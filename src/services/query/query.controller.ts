const fs = require('fs');
import { Controller, Post, Body, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { QueryService } from './query.service';
import { Answer, Query } from '../../models/query.model';
import { ChatGptAiService } from '../openai/openai.service';

@Controller('query')
export class QueryController {
  constructor(
    private readonly queryService: QueryService,
    private readonly chatGptService: ChatGptAiService,
    @InjectModel(Answer.name) private answerModel: Model<Answer>,
    @InjectModel(Query.name) private queryModel: Model<Query>
  ) { }

  // Following is the route where all the query requests fall
  @Post()
  async create(@Body() query: Query, @Req() req): Promise<{ statusCode: number, status: string, data?, error?}> {
    try {
      // here we will create a new query object (question asked by the user) and save it in Queries collection in MongoDB
      const newQuery = new this.queryModel({ user: new Types.ObjectId(query.user), text: query.text, role: "User", createdAt: new Date() });
      await newQuery.save();
      if (newQuery) {
        // here we call the Chatgpt OpenAi API to answer the query asked by the user

        // fetch previous history and pass it to the prompt, to maintain the context of the converstion
        const historyItems = await this.queryModel.aggregate([
          { $match: { user: new Types.ObjectId(query.user) } },
          {
            $lookup: {
              from: 'answers',
              localField: '_id',
              foreignField: 'query',
              as: 'answers'
            }
          },
          { $limit: 25 },
          {
            $match: {
              answers: {
                $elemMatch: {
                  $ne: null
                }
              }
            }
          },
          {
            $project: {
              query_id: '$_id',
              query_text: '$text',
              query_role: '$role',
              query_createdAt: '$createdAt',
              answer_id: { $arrayElemAt: ['$answers._id', 0] },
              answer_text: { $arrayElemAt: ['$answers.text', 0] },
              answer_role: { $arrayElemAt: ['$answers.role', 0] },
              answer_createdAt: { $arrayElemAt: ['$answers.createdAt', 0] },
              _id: 0
            }
          },
          {
            $sort: {
              query_createdAt: 1
            }
          }
        ]);

        let history = []
        for (let i = 0; i < historyItems.length; i++) {
          history.push({ role: historyItems[i].query_role, content: historyItems[i].query_text })
          history.push({ role: historyItems[i].answer_role, content: historyItems[i].answer_text })
        }
        // let prompt = history.map((item) => `${item.role}: ${item.content}`).join('\n') + '\n' + `User: ${newQuery.text}`;
        let prompt = `${newQuery.text}`;
        // console.log(prompt)
        let answer = await this.chatGptService.generateText(query.text, prompt, `${query.user}`);
        if (answer) {
          let trimmedAnswer = ''
          if (answer.text.startsWith("Assistant:")) {
            trimmedAnswer = answer.text.split("Assistant: ")[1]
          } else if (answer.text.startsWith("assistant:")) {
            trimmedAnswer = answer.text.split("assistant: ")[1]
          }
          else {
            trimmedAnswer = answer.text
          }
          const createdAnswer = new this.answerModel({ query: newQuery._id, text: trimmedAnswer, role: answer.role });
          await createdAnswer.save();
          let returningResp = {
            query_id: newQuery._id,
            query_text: newQuery.text,
            query_createdAt: newQuery.createdAt,
            answer_id: createdAnswer._id,
            answer_text: createdAnswer.text,
            answer_createdAt: createdAnswer.createdAt,
            _id: 0
          }
          console.log('response sent')
          return { statusCode: 201, status: 'success', data: returningResp };
        }
        return { statusCode: 400, status: 'false', data: null };
      }
      return { statusCode: 400, status: 'false', data: null };
    } catch (error) {
      return { statusCode: 500, status: 'error', error: error };
    }
  }
  // Following is the request that returns all the questions/queries and theirs answer saved in Database
  @Post('fetch')
  async findAll(@Body() body): Promise<{ statusCode: number, status: string, data: any, error?: string }> {
    try {
      const data = await this.queryModel.aggregate([
        { $match: { user: new Types.ObjectId(body.user) } },
        {
          $lookup: {
            from: 'answers',
            localField: '_id',
            foreignField: 'query',
            as: 'answers'
          }
        },
        { $limit: 25 },
        {
          $match: {
            answers: {
              $elemMatch: {
                $ne: null
              }
            }
          }
        },
        {
          $project: {
            query_id: '$_id',
            query_text: '$text',
            query_createdAt: '$createdAt',
            answer_id: { $arrayElemAt: ['$answers._id', 0] },
            answer_text: { $arrayElemAt: ['$answers.text', 0] },
            answer_createdAt: { $arrayElemAt: ['$answers.createdAt', 0] },
            _id: 0
          }
        },
        {
          $sort: {
            query_createdAt: 1
          }
        }
      ]);

      return { statusCode: 200, status: 'success', data };
    } catch (error) {
      return { statusCode: 500, status: 'error', data: null, error: error.message };
    }
  }
  @Post('fetch-env')
  async findAllEnv(@Body() body): Promise<{ statusCode: number, status: string, data: any, error?: string }> {
    try {
      let query_1 = process.env.query_1;
      let query_2 = process.env.query_2;
      let answer_1 = await this.chatGptService.generateText('Hi', query_1, 'abc');
      let answer_2 = await this.chatGptService.generateText("Hi", `${answer_1} ${query_2}`, 'abc');
      let data = [{ query: query_1, answer: answer_1 }, { query: query_2, answer: answer_2 }]
      return { statusCode: 200, status: 'success', data };
    } catch (error) {
      return { statusCode: 500, status: 'error', data: null, error: error.message };
    }
  }

}