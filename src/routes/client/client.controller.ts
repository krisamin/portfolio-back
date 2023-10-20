import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiOkResponse } from "@nestjs/swagger";

import { ClientResponseDto } from "./client.dto";
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
}
