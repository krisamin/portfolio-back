import { Injectable } from "@nestjs/common";
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
export class ClientService {
  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,

    @InjectModel(Team.name)
    private teamModel: Model<TeamDocument>,

    @InjectModel(Award.name)
    private awardModel: Model<AwardDocument>,
  ) {}

  async get(): Promise<{
    projects: ProjectDocument[];
    teams: TeamDocument[];
    awards: AwardDocument[];
  }> {
    return {
      projects: await this.projectModel.find(),
      teams: await this.teamModel.find(),
      awards: await this.awardModel.find(),
    };
  }
}
