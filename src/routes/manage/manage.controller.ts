import { Controller, Get } from "@nestjs/common";

import { ProjectDocument, TeamDocument, AwardDocument } from "src/schemas";

import { ManageService } from "./manage.service";

@Controller("manage")
export class ManageController {
  constructor(private readonly manageService: ManageService) {}

  @Get("update")
  async updateNotion(): Promise<{
    projects: ProjectDocument[];
    teams: TeamDocument[];
    awards: AwardDocument[];
  }> {
    return this.manageService.updateNotion();
  }
}
