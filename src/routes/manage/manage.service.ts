import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import {
  Project,
  ProjectDocument,
  Team,
  TeamDocument,
  Award,
  AwardDocument,
} from "src/schemas";

@Injectable()
export class ManageService {
  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,

    @InjectModel(Team.name)
    private teamModel: Model<TeamDocument>,

    @InjectModel(Award.name)
    private awardModel: Model<AwardDocument>,

    private readonly configService: ConfigService,

    private readonly httpService: HttpService,
  ) {}

  async getNotionDatabase(databaseId: string): Promise<any> {
    const { data } = await this.httpService.axiosRef.post(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {},
      {
        headers: {
          Authorization: `Bearer ${this.configService.get<string>(
            "NOTION_SECRET",
          )}`,
          "Notion-Version": "2022-06-28",
        },
      },
    );

    return data.results;
  }

  async updateNotion(): Promise<{
    projects: ProjectDocument[];
    teams: TeamDocument[];
    awards: AwardDocument[];
  }> {
    interface Project {
      id: string;
      key: string;
      name: string;
      team: [string];
      award: [string];
    }

    interface Team {
      id: string;
      key: string;
      name: string;
      project: [string];
      award: [string];
    }

    interface Award {
      id: string;
      key: string;
      name: string;
      period: string;
      project: [string];
      team: [string];
    }

    const projectData: Project[] = [];
    const teamData: Team[] = [];
    const awardData: Award[] = [];

    const projectDatabase = await this.getNotionDatabase(
      "64ac81fd35804bf69efac24a04c399d7",
    );

    const teamDatabase = await this.getNotionDatabase(
      "9d6ed9f46e5b46f7b546e06f72a81a02",
    );

    const awardDatabase = await this.getNotionDatabase(
      "9edcbb9e27db46a2be3bc392c8fbe571",
    );

    for (const item of projectDatabase) {
      if (item.archived) continue;
      projectData.push({
        id: item.id,
        key: item.properties.key.rich_text[0].plain_text,
        name: item.properties.name.title[0].plain_text,
        team: item.properties.team.relation.map(
          (relation: { id: string }) => relation.id,
        ),
        award: item.properties.award.relation.map(
          (relation: { id: string }) => relation.id,
        ),
      });
    }

    for (const item of teamDatabase) {
      if (item.archived) continue;
      teamData.push({
        id: item.id,
        key: item.properties.key.rich_text[0].plain_text,
        name: item.properties.name.title[0].plain_text,
        project: item.properties.project.relation.map(
          (relation: { id: string }) => relation.id,
        ),
        award: item.properties.award.relation.map(
          (relation: { id: string }) => relation.id,
        ),
      });
    }

    for (const item of awardDatabase) {
      if (item.archived) continue;
      awardData.push({
        id: item.id,
        key: item.properties.key.rich_text[0].plain_text,
        name: item.properties.name.title[0].plain_text,
        period: item.properties.period.rich_text[0].plain_text,
        project: item.properties.project.relation.map(
          (relation: { id: string }) => relation.id,
        ),
        team: item.properties.team.relation.map(
          (relation: { id: string }) => relation.id,
        ),
      });
    }

    await this.projectModel.deleteMany({});
    await this.projectModel.insertMany(projectData);

    await this.teamModel.deleteMany({});
    await this.teamModel.insertMany(teamData);

    await this.awardModel.deleteMany({});
    await this.awardModel.insertMany(awardData);

    return {
      projects: await this.projectModel.find(),
      teams: await this.teamModel.find(),
      awards: await this.awardModel.find(),
    };
  }
}
