"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryController = void 0;
const fs = require('fs');
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const query_service_1 = require("./query.service");
const query_model_1 = require("../../models/query.model");
const openai_service_1 = require("../openai/openai.service");
let QueryController = class QueryController {
    constructor(queryService, chatGptService, answerModel, queryModel) {
        this.queryService = queryService;
        this.chatGptService = chatGptService;
        this.answerModel = answerModel;
        this.queryModel = queryModel;
    }
    async create(query, req) {
        try {
            const newQuery = new this.queryModel({ user: new mongoose_2.Types.ObjectId(query.user), text: query.text, role: "User", createdAt: new Date() });
            await newQuery.save();
            if (newQuery) {
                const historyItems = await this.queryModel.aggregate([
                    { $match: { user: new mongoose_2.Types.ObjectId(query.user) } },
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
                let history = [];
                for (let i = 0; i < historyItems.length; i++) {
                    history.push({ role: historyItems[i].query_role, content: historyItems[i].query_text });
                    history.push({ role: historyItems[i].answer_role, content: historyItems[i].answer_text });
                }
                let prompt = `${newQuery.text}`;
                let answer = await this.chatGptService.generateText(query.text, prompt, `${query.user}`);
                if (answer) {
                    let trimmedAnswer = '';
                    if (answer.text.startsWith("Assistant:")) {
                        trimmedAnswer = answer.text.split("Assistant: ")[1];
                    }
                    else if (answer.text.startsWith("assistant:")) {
                        trimmedAnswer = answer.text.split("assistant: ")[1];
                    }
                    else {
                        trimmedAnswer = answer.text;
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
                    };
                    console.log('response sent');
                    return { statusCode: 201, status: 'success', data: returningResp };
                }
                return { statusCode: 400, status: 'false', data: null };
            }
            return { statusCode: 400, status: 'false', data: null };
        }
        catch (error) {
            return { statusCode: 500, status: 'error', error: error };
        }
    }
    async findAll(body) {
        try {
            const data = await this.queryModel.aggregate([
                { $match: { user: new mongoose_2.Types.ObjectId(body.user) } },
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
        }
        catch (error) {
            return { statusCode: 500, status: 'error', data: null, error: error.message };
        }
    }
    async findAllEnv(body) {
        try {
            let query_1 = process.env.query_1;
            let query_2 = process.env.query_2;
            let answer_1 = await this.chatGptService.generateText('Hi', query_1, 'abc');
            let answer_2 = await this.chatGptService.generateText("Hi", `${answer_1} ${query_2}`, 'abc');
            let data = [{ query: query_1, answer: answer_1 }, { query: query_2, answer: answer_2 }];
            return { statusCode: 200, status: 'success', data };
        }
        catch (error) {
            return { statusCode: 500, status: 'error', data: null, error: error.message };
        }
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_model_1.Query, Object]),
    __metadata("design:returntype", Promise)
], QueryController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('fetch'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QueryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('fetch-env'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QueryController.prototype, "findAllEnv", null);
QueryController = __decorate([
    (0, common_1.Controller)('query'),
    __param(2, (0, mongoose_1.InjectModel)(query_model_1.Answer.name)),
    __param(3, (0, mongoose_1.InjectModel)(query_model_1.Query.name)),
    __metadata("design:paramtypes", [query_service_1.QueryService,
        openai_service_1.ChatGptAiService,
        mongoose_2.Model,
        mongoose_2.Model])
], QueryController);
exports.QueryController = QueryController;
//# sourceMappingURL=query.controller.js.map