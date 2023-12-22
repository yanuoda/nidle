import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { buildEqualWhere, checkValue } from 'src/utils';
import { ProjectService } from 'src/system/project/project.service';
import { AirlinePublish } from './airline_publish.entity';
import {
  CreateAirlinePublishDto,
  QeuryAirlinePublishListDTO,
  UpdateAirlinePublishDto,
} from './airline_publish.dto';

@Injectable()
export class AirlineService {
  constructor(
    @InjectRepository(AirlinePublish)
    private readonly airlineRepository: Repository<AirlinePublish>,
    private readonly projectService: ProjectService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async create(param: CreateAirlinePublishDto) {
    const newAirlinePublish = new AirlinePublish();
    Object.assign(newAirlinePublish, param);
    return await this.airlineRepository.save(newAirlinePublish);
  }

  async findAllByPage({
    airline,
    environment,
    current,
    pageSize,
  }: QeuryAirlinePublishListDTO) {
    const [_list, total] = await this.airlineRepository.findAndCount({
      skip: (current - 1) * pageSize,
      take: pageSize,
      order: { createdTime: 'DESC' },
      where: buildEqualWhere<AirlinePublish>({ airline, environment }),
    });
    let list = _list;
    if (_list.length) {
      const projectServerList = await this.projectService.fetchProjectServerBy({
        id: In(_list.map(({ projectServer }) => projectServer)),
      });
      list = list.map((item) => {
        const _projectServer = projectServerList.find(
          ({ id }) => id === item.projectServer,
        );
        return {
          ...item,
          name: _projectServer.Server.name,
          ip: _projectServer.Server.ip,
          projectServerOutput: _projectServer.output,
        };
      });
    }
    return { list, total };
  }

  async findOne(id: number) {
    checkValue(id, '航司发布配置id');
    const existAirlinePublish = await this.airlineRepository.findOneBy({ id });
    if (!existAirlinePublish) {
      throw new Error(`航司发布配置id:${id}不存在`);
    }
    return existAirlinePublish;
  }

  async update({ id, ...restParam }: UpdateAirlinePublishDto) {
    const existAirlinePublish = await this.findOne(id);
    Object.assign(existAirlinePublish, restParam);
    return await this.airlineRepository.save(existAirlinePublish);
  }

  async remove(id: number) {
    const airline = await this.findOne(id);
    this.logger.info(`delete airline:${id}`, {
      original: airline,
    });
    return await this.airlineRepository.delete({ id });
  }
}
