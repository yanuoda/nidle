import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { buildLikeWhere } from 'src/utils';
import {
  CreateServerDTO,
  UpdateServerDTO,
  QeuryServerListDTO,
} from './server.dto';
import { Server } from './server.entity';

@Injectable()
export class ServerService {
  constructor(
    @InjectRepository(Server)
    private readonly serverRepository: Repository<Server>,
  ) {}

  async create(param: CreateServerDTO) {
    const newServer = new Server();
    Object.assign(newServer, param);
    newServer.status = 1;
    return await this.serverRepository.save(newServer);
  }

  async findAll({
    environment,
    name,
    ip,
    current,
    pageSize,
  }: QeuryServerListDTO) {
    const [list, total] = await this.serverRepository.findAndCount({
      select: ['id', 'name', 'ip'],
      skip: (current - 1) * pageSize,
      take: pageSize,
      order: { createdTime: 'DESC' },
      where: buildLikeWhere<Server>({ name, ip }, { environment, status: 1 }),
    });
    return { list, total };
  }

  async findOne(id: number) {
    const existServer = await this.serverRepository.findOne({ where: { id } });
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
    return await this.serverRepository.delete({ id });
  }
}
