import { AnswerService } from './answer.service';
import { Answer } from '../../models/query.model';
export declare class AnswerController {
    private readonly answerService;
    constructor(answerService: AnswerService);
    create(answer: Answer): Promise<Answer>;
    findAll(): Promise<Answer[]>;
    findOne(id: string): Promise<Answer>;
    update(id: string, answer: Answer): Promise<Answer>;
    remove(id: string): Promise<Answer>;
}
