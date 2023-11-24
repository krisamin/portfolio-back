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
  name_en: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  description_en: string;

  @Prop({ required: true })
  teams: string[];

  @Prop({ required: true })
  awards: string[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
