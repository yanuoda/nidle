import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { buildEqualWhere, buildLikeWhere, checkValue } from 'src/utils';
import {
  CreateServerDTO,
  UpdateServerDTO,
  QeuryServerListDTO,
  GetAllServersDTO,
} from './server.dto';
import { Server } from './server.entity';

@Injectable()
export class ServerService {
  constructor(
    @InjectRepository(Server)
    private readonly serverRepository: Repository<Server>,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async create(param: CreateServerDTO) {
    const newServer = new Server();
    Object.assign(newServer, param);
    newServer.status = 1;
    return await this.serverRepository.save(newServer);
  }

  async findAll(param: GetAllServersDTO) {
    return await this.serverRepository.find({
      where: buildEqualWhere(param),
      select: ['id', 'name', 'ip', 'environment', 'description', 'status'],
      order: { createdTime: 'DESC' },
    });
  }

  async findAllByPage({
    environment,
    name,
    ip,
    current,
    pageSize,
  }: QeuryServerListDTO) {
    const [list, total] = await this.serverRepository.findAndCount({
      // select: ['id', 'name', 'ip', 'environment'],
      skip: (current - 1) * pageSize,
      take: pageSize,
      order: { createdTime: 'DESC' },
      where: {
        ...buildEqualWhere<Server>({ environment }),
        ...buildLikeWhere<Server>({ name, ip }),
      },
    });
    return { list, total };
  }

  async findOne(id: number) {
    checkValue(id, '服务器id');
    const existServer = await this.serverRepository.findOneBy({ id });
    if (!existServer) {
      throw new Error(`服务器id:${id}不存在`);
    }
    return existServer;
  }

  async update({ id, ...restParam }: UpdateServerDTO) {
    const existServer = await this.findOne(id);
    Object.assign(existServer, restParam);
    return await this.serverRepository.save(existServer);
  }

  async remove(id: number) {
    const server = await this.findOne(id);
    this.logger.info(`delete server:${id}`, {
      original: server,
    });
    return await this.serverRepository.delete({ id });
  }
}
