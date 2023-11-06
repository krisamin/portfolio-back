import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

import { schemaOptions } from "./options";

export type ContentDocument = HydratedDocument<Content>;

@Schema(schemaOptions)
export class Content {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  content: string;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
