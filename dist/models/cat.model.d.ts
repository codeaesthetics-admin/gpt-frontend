import { SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type CatDocument = Cat & Document;
export declare class Cat {
    name: string;
    age: number;
    breed: string;
}
export declare const CatSchema: typeof SchemaFactory.createForClass;
