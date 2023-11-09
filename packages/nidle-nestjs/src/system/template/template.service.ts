import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { buildEqualWhere, buildLikeWhere } from 'src/utils';
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
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async create(createTemplateDto: CreateTemplateDto) {
    const newTemp = new Template();
    Object.assign(newTemp, createTemplateDto);
    return await this.templateRepository.save(newTemp);
  }

  async findAllByPage({
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
    const _where = buildEqualWhere(where);
    if (!Object.keys(_where).length) {
      throw new Error('findOne 的条件(where)不能为空');
    }
    const existTemplate = await this.templateRepository.findOneBy(_where);
    if (!existTemplate) {
      throw new Error(`模板不存在 - where:${JSON.stringify(_where)}`);
    }
    return existTemplate;
  }

  async update({ id, ...restParam }: UpdateTemplateDto) {
    const existTemplate = await this.findOneBy({ id });
    Object.assign(existTemplate, restParam);
    return await this.templateRepository.save(existTemplate);
  }

  async remove(id: number) {
    const template = await this.findOneBy({ id });
    this.logger.info(`delete template:${id}`, {
      original: template,
    });
    return await this.templateRepository.delete({ id });
  }
}
