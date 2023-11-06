import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiOkResponse } from "@nestjs/swagger";

import { ClientResponseDto, ProjectDetailResponseDto } from "./client.dto";
import { ClientService } from "./client.service";

@Controller()
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  @ApiOperation({
    summary: "프로젝트, 팀, 상 조회",
  })
  @ApiOkResponse({
    type: ClientResponseDto,
  })
  async get(): Promise<ClientResponseDto> {
    return this.clientService.get();
  }

  @Get("/project/:key")
  @ApiOperation({
    summary: "프로젝트 조회",
  })
  @ApiOkResponse({
    type: ProjectDetailResponseDto,
  })
  async getProject(
    @Param("key") key: string,
  ): Promise<ProjectDetailResponseDto> {
    return this.clientService.getProject(key);
  }
}
