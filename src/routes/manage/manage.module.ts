import { HttpModule } from "@nestjs/axios";
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

import { ManageController } from "./manage.controller";
import { ManageService } from "./manage.service";

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
    HttpModule,
  ],
  controllers: [ManageController],
  providers: [ManageService],
})
export class ManageModule {}
