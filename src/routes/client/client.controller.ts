import { Controller, Get } from "@nestjs/common";

import { ProjectDocument, TeamDocument, AwardDocument } from "src/schemas";

import { ClientService } from "./client.service";

@Controller()
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  async get(): Promise<{
    projects: ProjectDocument[];
    teams: TeamDocument[];
    awards: AwardDocument[];
  }> {
    return this.clientService.get();
  }
}
