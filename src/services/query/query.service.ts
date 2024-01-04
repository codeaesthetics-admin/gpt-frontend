import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Query } from '../../models/query.model';

@Injectable()
export class QueryService {
  constructor(@InjectModel(Query.name) private queryModel: Model<Query>) {}

  async create(query: Query): Promise<Query> {
    const createdQuery = new this.queryModel(query);
    return createdQuery.save();
  }

  async findAll(): Promise<Query[]> {
    return this.queryModel.find().exec();
  }

  async findOne(id: string): Promise<Query> {
    return this.queryModel.findById(id).exec();
  }

  async update(id: string, query: Query): Promise<Query> {
    return this.queryModel.findByIdAndUpdate(id, query, { new: true }).exec();
  }

  async remove(id: string): Promise<Query> {
    return this.queryModel.findByIdAndRemove(id).exec();
  }
}
