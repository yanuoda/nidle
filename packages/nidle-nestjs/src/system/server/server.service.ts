import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOptionsWhere, Like } from 'typeorm';

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
    const options: FindManyOptions<Server> = {
      select: ['id', 'name', 'ip'],
      skip: (current - 1) * pageSize,
      take: pageSize,
      order: { createdTime: 'DESC' },
    };
    const _where: FindOptionsWhere<Server> = { status: 1 };
    if (environment) _where.environment = environment;
    if (name) _where.name = Like(`${name}%`);
    if (ip) _where.ip = Like(`${ip}%`);
    options.where = _where;
    const [list, total] = await this.serverRepository.findAndCount(options);
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
    const existServer = await this.serverRepository.findOne({ where: { id } });
    if (!existServer) {
      throw new Error(`服务器id:${id}不存在`);
    }
    Object.assign(existServer, restParam);
    return await this.serverRepository.save(existServer);
  }

  async remove(id: number) {
    return await this.serverRepository.delete({ id });
  }
}
