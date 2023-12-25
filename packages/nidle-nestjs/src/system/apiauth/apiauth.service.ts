import * as crypto from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { buildLikeWhere, checkValue } from 'src/utils';
import {
  CreateApiauthDto,
  QeuryApiauthListDTO,
  UpdateApiauthDto,
} from './apiauth.dto';
import { Apiauth } from './apiauth.entity';

@Injectable()
export class ApiauthService {
  constructor(
    @InjectRepository(Apiauth)
    private readonly apiauthRepository: Repository<Apiauth>,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}
  async create(param: CreateApiauthDto) {
    const newApiauth = new Apiauth();
    Object.assign(newApiauth, param);
    newApiauth.apiKey = crypto
      .randomUUID({ disableEntropyCache: true })
      .replace(/-/g, '');
    return await this.apiauthRepository.save(newApiauth);
  }

  async findAllByPage({ name, current, pageSize }: QeuryApiauthListDTO) {
    const [list, total] = await this.apiauthRepository.findAndCount({
      skip: (current - 1) * pageSize,
      take: pageSize,
      order: { createdTime: 'DESC' },
      where: buildLikeWhere<Apiauth>({ name }),
    });
    return { list, total };
  }

  async findOne(id: number) {
    checkValue(id, 'API调用权限配置id');
    const existAirlinePublish = await this.apiauthRepository.findOneBy({ id });
    if (!existAirlinePublish) {
      throw new Error(`API调用权限配置id:${id}不存在`);
    }
    return existAirlinePublish;
  }

  async update({ id, ...restParam }: UpdateApiauthDto) {
    const existApiauth = await this.findOne(id);
    Object.assign(existApiauth, restParam);
    return await this.apiauthRepository.save(existApiauth);
  }

  async remove(id: number) {
    const apiauth = await this.findOne(id);
    this.logger.info(`delete apiauth:${id}`, {
      original: apiauth,
    });
    return await this.apiauthRepository.delete({ id });
  }
}
