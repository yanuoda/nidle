import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

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

  async findOneBy(where: FindOptionsWhere<Template>) {
    const existTemplate = await this.templateRepository.findOneBy(where);
    if (!existTemplate) {
      throw new Error(`模板不存在 - where:${JSON.stringify(where)}`);
    }
    return existTemplate;
  }

  async update({ id, ...restParam }: UpdateTemplateDto) {
    const existTemplate = await this.findOneBy({ id });
    Object.assign(existTemplate, restParam);
    return await this.templateRepository.save(existTemplate);
  }

  async remove(id: number) {
    return await this.templateRepository.delete({ id });
  }
}
