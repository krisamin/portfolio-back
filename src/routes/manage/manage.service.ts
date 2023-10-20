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

  async getNotionData(databaseId: string): Promise<any> {
    try {
      const { data } = await this.httpService.axiosRef.post(
        `https://api.notion.com/v1/databases/${databaseId}/query`,
        {
          sorts: [
            {
              property: "order",
              direction: "descending",
            },
          ],
        },
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
    } catch (error) {
      console.error(error);
    }
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
      teams: [string];
      awards: [string];
    }

    interface Team {
      id: string;
      key: string;
      name: string;
      projects: [string];
      awards: [string];
    }

    interface Award {
      id: string;
      key: string;
      name: string;
      period: string;
      projects: [string];
      teams: [string];
    }

    const projects: Project[] = [];
    const teams: Team[] = [];
    const awards: Award[] = [];

    const projectsData = await this.getNotionData(
      "64ac81fd35804bf69efac24a04c399d7",
    );

    const teamsData = await this.getNotionData(
      "9d6ed9f46e5b46f7b546e06f72a81a02",
    );

    const awardsData = await this.getNotionData(
      "9edcbb9e27db46a2be3bc392c8fbe571",
    );

    for (const item of projectsData) {
      if (item.archived) continue;
      projects.push({
        id: item.id,
        key: item.properties.key.rich_text[0].plain_text,
        name: item.properties.name.title[0].plain_text,
        teams: item.properties.teams.relation.map(
          (relation: { id: string }) => relation.id,
        ),
        awards: item.properties.awards.relation.map(
          (relation: { id: string }) => relation.id,
        ),
      });
    }

    for (const item of teamsData) {
      if (item.archived) continue;
      teams.push({
        id: item.id,
        key: item.properties.key.rich_text[0].plain_text,
        name: item.properties.name.title[0].plain_text,
        projects: item.properties.projects.relation.map(
          (relation: { id: string }) => relation.id,
        ),
        awards: item.properties.awards.relation.map(
          (relation: { id: string }) => relation.id,
        ),
      });
    }

    for (const item of awardsData) {
      if (item.archived) continue;
      awards.push({
        id: item.id,
        key: item.properties.key.rich_text[0].plain_text,
        name: item.properties.name.title[0].plain_text,
        period: item.properties.period.rich_text[0].plain_text,
        projects: item.properties.projects.relation.map(
          (relation: { id: string }) => relation.id,
        ),
        teams: item.properties.teams.relation.map(
          (relation: { id: string }) => relation.id,
        ),
      });
    }

    await this.projectModel.deleteMany({});
    await this.projectModel.insertMany(projects);

    await this.teamModel.deleteMany({});
    await this.teamModel.insertMany(teams);

    await this.awardModel.deleteMany({});
    await this.awardModel.insertMany(awards);

    return {
      projects: await this.projectModel.find(),
      teams: await this.teamModel.find(),
      awards: await this.awardModel.find(),
    };
  }
}
