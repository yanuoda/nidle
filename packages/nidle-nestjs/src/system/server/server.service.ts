import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { buildEqualWhere, buildLikeWhere } from 'src/utils';
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

  async findAll() {
    return await this.serverRepository.find({
      select: ['id', 'name', 'ip'],
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
      select: ['id', 'name', 'ip'],
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
    return await this.serverRepository.delete({ id });
  }
}
