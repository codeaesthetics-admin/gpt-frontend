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
exports.QueryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const query_model_1 = require("../../models/query.model");
let QueryService = class QueryService {
    constructor(queryModel) {
        this.queryModel = queryModel;
    }
    async create(query) {
        const createdQuery = new this.queryModel(query);
        return createdQuery.save();
    }
    async findAll() {
        return this.queryModel.find().exec();
    }
    async findOne(id) {
        return this.queryModel.findById(id).exec();
    }
    async update(id, query) {
        return this.queryModel.findByIdAndUpdate(id, query, { new: true }).exec();
    }
    async remove(id) {
        return this.queryModel.findByIdAndRemove(id).exec();
    }
};
QueryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(query_model_1.Query.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], QueryService);
exports.QueryService = QueryService;
//# sourceMappingURL=query.service.js.map