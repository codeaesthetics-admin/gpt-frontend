import { Model } from 'mongoose';
import { QueryService } from './query.service';
import { Answer, Query } from '../../models/query.model';
import { ChatGptAiService } from '../openai/openai.service';
export declare class QueryController {
    private readonly queryService;
    private readonly chatGptService;
    private answerModel;
    private queryModel;
    constructor(queryService: QueryService, chatGptService: ChatGptAiService, answerModel: Model<Answer>, queryModel: Model<Query>);
    create(query: Query, req: any): Promise<{
        statusCode: number;
        status: string;
        data?: any;
        error?: any;
    }>;
    findAll(body: any): Promise<{
        statusCode: number;
        status: string;
        data: any;
        error?: string;
    }>;
    findAllEnv(body: any): Promise<{
        statusCode: number;
        status: string;
        data: any;
        error?: string;
    }>;
}
