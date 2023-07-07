import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { buildLikeWhere } from 'src/utils';
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
    return await this.templateRepository.save(newTemp);
  }

  async findAll({
    name,
    description,
    current,
    pageSize,
  }: QueryTemplateListDTO) {
    const [list, total] = await this.templateRepository.findAndCount({
      select: ['id', 'name', 'description'],
      skip: (current - 1) * pageSize,
      take: pageSize,
      order: { createdTime: 'DESC' },
      where: buildLikeWhere<Template>({ name, description }),
    });
    return { list, total };
  }

  async findOne(id: number) {
    const existTemplate = await this.templateRepository.findOneBy({ id });
    if (!existTemplate) {
      throw new Error(`模板id:${id}不存在`);
    }
    return existTemplate;
  }

  async update({ id, ...restParam }: UpdateTemplateDto) {
    const existTemplate = await this.findOne(id);
    Object.assign(existTemplate, restParam);
    return await this.templateRepository.save(existTemplate);
  }

  async remove(id: number) {
    return await this.templateRepository.delete({ id });
  }
}
