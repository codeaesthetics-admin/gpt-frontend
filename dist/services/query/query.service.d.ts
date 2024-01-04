import { Model } from 'mongoose';
import { Query } from '../../models/query.model';
export declare class QueryService {
    private queryModel;
    constructor(queryModel: Model<Query>);
    create(query: Query): Promise<Query>;
    findAll(): Promise<Query[]>;
    findOne(id: string): Promise<Query>;
    update(id: string, query: Query): Promise<Query>;
    remove(id: string): Promise<Query>;
}
