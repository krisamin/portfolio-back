import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import {
  Project,
  ProjectSchema,
  Team,
  TeamSchema,
  Award,
  AwardSchema,
  Content,
  ContentSchema,
} from "src/schemas";

import { ClientController } from "./client.controller";
import { ClientService } from "./client.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Project.name,
        schema: ProjectSchema,
      },
      {
        name: Team.name,
        schema: TeamSchema,
      },
      {
        name: Award.name,
        schema: AwardSchema,
      },
      {
        name: Content.name,
        schema: ContentSchema,
      },
    ]),
  ],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
