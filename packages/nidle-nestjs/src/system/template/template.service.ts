import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOptionsWhere, Like } from 'typeorm';

import {
  CreateTemplateDto,
  QueryTemplateListDTO,
  UpdateTemplateDto,
} from './template.dto';
import { Template } from './template.entity';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
  ) {}

  async create(createTemplateDto: CreateTemplateDto) {
    const newTemp = new Template();
    Object.assign(newTemp, createTemplateDto);
    newTemp.status = 1;
    return await this.templateRepository.save(newTemp);
  }

  async findAll({
    name,
    description,
    current,
    pageSize,
  }: QueryTemplateListDTO) {
    const options: FindManyOptions<Template> = {
      select: ['id', 'name', 'description'],
      skip: (current - 1) * pageSize,
      take: pageSize,
      order: { createdTime: 'DESC' },
    };
    const _where: FindOptionsWhere<Template> = { status: 1 };
    if (name) _where.name = Like(`${name}%`);
    if (description) _where.description = Like(`${description}%`);
    options.where = _where;
    const [list, total] = await this.templateRepository.findAndCount(options);
    return { list, total };
  }

  async findOne(id: number) {
    const existTemplate = await this.templateRepository.findOne({
      where: { id },
    });
    if (!existTemplate) {
      throw new Error(`模板id:${id}不存在`);
    }
    return existTemplate;
  }

  async update({ id, ...restParam }: UpdateTemplateDto) {
    const existTemplate = await this.templateRepository.findOne({
      where: { id },
    });
    if (!existTemplate) {
      throw new Error(`模板id:${id}不存在`);
    }
    Object.assign(existTemplate, restParam);
    return await this.templateRepository.save(existTemplate);
  }

  async remove(id: number) {
    return await this.templateRepository.delete({ id });
  }
}
