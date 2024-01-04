import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Answer } from '../../models/query.model';

@Injectable()
export class AnswerService {
  constructor(@InjectModel(Answer.name) private answerModel: Model<Answer>) {}

  async create(answer: Answer): Promise<Answer> {
    const createdAnswer = new this.answerModel(answer);
    return createdAnswer.save();
  }

  async findAll(): Promise<Answer[]> {
    return this.answerModel.find().populate('query').exec();
  }

  async findOne(id: string): Promise<Answer> {
    return this.answerModel.findById(id).populate('query').exec();
  }

  async update(id: string, answer: Answer): Promise<Answer> {
    return this.answerModel.findByIdAndUpdate(id, answer, { new: true }).exec();
  }

  async remove(id: string): Promise<Answer> {
    return this.answerModel.findByIdAndRemove(id).exec();
  }
}

