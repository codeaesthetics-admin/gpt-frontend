import { Model } from 'mongoose';
import { Answer } from '../../models/query.model';
export declare class AnswerService {
    private answerModel;
    constructor(answerModel: Model<Answer>);
    create(answer: Answer): Promise<Answer>;
    findAll(): Promise<Answer[]>;
    findOne(id: string): Promise<Answer>;
    update(id: string, answer: Answer): Promise<Answer>;
    remove(id: string): Promise<Answer>;
}
