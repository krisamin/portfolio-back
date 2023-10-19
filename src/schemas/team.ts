import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

import { schemaOptions } from "./options";

export type TeamDocument = HydratedDocument<Team>;

@Schema(schemaOptions)
export class Team {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  project: string[];

  @Prop({ required: true })
  award: string[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);
