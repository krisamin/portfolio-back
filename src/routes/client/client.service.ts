import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import {
  Project,
  ProjectDocument,
  Team,
  TeamDocument,
  Award,
  AwardDocument,
  Content,
  ContentDocument,
} from "src/schemas";

import {
  ClientResponseDto,
  ProjectResponseBaseDto,
  ProjectResponseDto,
  TeamResponseBaseDto,
  TeamResponseDto,
  AwardResponseBaseDto,
  AwardResponseDto,
  ProjectDetailResponseDto,
} from "./client.dto";

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,

    @InjectModel(Team.name)
    private teamModel: Model<TeamDocument>,

    @InjectModel(Award.name)
    private awardModel: Model<AwardDocument>,

    @InjectModel(Content.name)
    private contentModel: Model<ContentDocument>,
  ) {}

  async get(): Promise<ClientResponseDto> {
    const projects = await this.projectModel.find().lean();
    const teams = await this.teamModel.find().lean();
    const awards = await this.awardModel.find().lean();

    const newProjects: ProjectResponseDto[] = [];
    const newTeams: TeamResponseDto[] = [];
    const newAwards: AwardResponseDto[] = [];

    for (const project of projects) {
      const newTeam: TeamResponseBaseDto[] = [];
      const newAward: AwardResponseBaseDto[] = [];

      for (const team of project.teams) {
        const target = { ...teams.find((item) => item.id === team) };
        if (!Object.keys(target).length) continue;
        delete target.projects;
        delete target.awards;
        newTeam.push(target);
      }

      for (const award of project.awards) {
        const target = { ...awards.find((item) => item.id === award) };
        if (!Object.keys(target).length) continue;
        delete target.projects;
        delete target.teams;
        newAward.push(target);
      }

      delete project.teams;
      delete project.awards;

      newProjects.push({
        ...project,
        teams: newTeam,
        awards: newAward,
      });
    }

    for (const team of teams) {
      const newProject: ProjectResponseBaseDto[] = [];
      const newAward: AwardResponseBaseDto[] = [];

      for (const project of team.projects) {
        const target = { ...projects.find((item) => item.id === project) };
        if (!Object.keys(target).length) continue;
        delete target.teams;
        delete target.awards;
        newProject.push(target);
      }

      for (const award of team.awards) {
        const target = { ...awards.find((item) => item.id === award) };
        if (!Object.keys(target).length) continue;
        delete target.projects;
        delete target.teams;
        newAward.push(target);
      }

      delete team.projects;
      delete team.awards;

      newTeams.push({
        ...team,
        projects: newProject,
        awards: newAward,
      });
    }

    for (const award of awards) {
      const newProject: ProjectResponseBaseDto[] = [];
      const newTeam: TeamResponseBaseDto[] = [];

      for (const project of award.projects) {
        const target = { ...projects.find((item) => item.id === project) };
        if (!Object.keys(target).length) continue;
        delete target.teams;
        delete target.awards;
        newProject.push(target);
      }

      for (const team of award.teams) {
        const target = { ...teams.find((item) => item.id === team) };
        if (!Object.keys(target).length) continue;
        delete target.projects;
        delete target.awards;
        newTeam.push(target);
      }

      delete award.projects;
      delete award.teams;

      newAwards.push({
        ...award,
        projects: newProject,
        teams: newTeam,
      });
    }

    return {
      projects: newProjects,
      teams: newTeams,
      awards: newAwards,
    };
  }

  async getProject(key: string): Promise<ProjectDetailResponseDto> {
    const data = await this.get();
    const project = data.projects.find((item) => item.key === key);
    if (!project) throw new HttpException("프로젝트를 찾을 수 없습니다.", 404);

    const content = await this.contentModel.findOne({ id: project.id }).lean();

    return {
      info: project,
      content: content?.content || "",
    };
  }
}
