import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { Answer } from '../../models/query.model';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post()
  async create(@Body() answer: Answer): Promise<Answer> {
    return this.answerService.create(answer);
  }

  @Get()
  async findAll(): Promise<Answer[]> {
    return this.answerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Answer> {
    return this.answerService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() answer: Answer): Promise<Answer> {
    return this.answerService.update(id, answer);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Answer> {
    return this.answerService.remove(id);
  }
}