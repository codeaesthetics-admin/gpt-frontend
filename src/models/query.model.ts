import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema()
export class Query extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: string;

  @Prop()
  text: string;

  @Prop()
  role: string;

  @Prop()
  createdAt: Date;
}

export const QuerySchema = SchemaFactory.createForClass(Query);

@Schema()
export class Answer extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Query' })
  query: Query;

  @Prop()
  text: string;

  @Prop()
  role: string;

  @Prop()
  createdAt: Date;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
