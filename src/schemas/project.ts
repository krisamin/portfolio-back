import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

import { schemaOptions } from "./options";

export type ProjectDocument = HydratedDocument<Project>;

@Schema(schemaOptions)
export class Project {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  team: string[];

  @Prop({ required: true })
  award: string[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
