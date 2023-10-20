import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

import { schemaOptions } from "./options";
import { Project } from "./project";
import { Team } from "./team";

export type AwardDocument = HydratedDocument<Award>;

@Schema(schemaOptions)
export class Award {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  period: string;

  @Prop({ required: true })
  projects: Project[];

  @Prop({ required: true })
  teams: [Team];
}

export const AwardSchema = SchemaFactory.createForClass(Award);
