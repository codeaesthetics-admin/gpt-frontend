/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Document } from 'mongoose';
export declare class Query extends Document {
    user: string;
    text: string;
    role: string;
    createdAt: Date;
}
export declare const QuerySchema: import("mongoose").Schema<Query, import("mongoose").Model<Query, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Query>;
export declare class Answer extends Document {
    query: Query;
    text: string;
    role: string;
    createdAt: Date;
}
export declare const AnswerSchema: import("mongoose").Schema<Answer, import("mongoose").Model<Answer, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Answer>;
