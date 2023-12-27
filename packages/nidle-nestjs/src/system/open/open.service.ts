import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'node-scp';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { ApiauthService } from 'src/system/apiauth/apiauth.service';
import { AirlinePublishService } from 'src/system/biz/airline/airline_publish.service';
import { nidleConfig } from 'src/configuration';
import { AirlineConfigPublishDto } from './open.dto';

@Injectable()
export class OpenService {
  _nidleConfig: ConfigType<typeof nidleConfig>;
  constructor(
    private readonly configService: ConfigService,
    private readonly apiauthService: ApiauthService,
    private readonly airlinePublishService: AirlinePublishService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {
    this._nidleConfig = this.configService.get('nidleConfig');
  }

  async checkApiAuth(apiKey: string) {
    const data = await this.apiauthService.findActiveOneByKey(apiKey);
    if (!data) throw new Error('无权限调用此接口，请联系申请');
    return data.id;
  }

  /**
   * 发布航司配置
   * - checkApiAuth
   * - 根据 airline, env 查询所有航司发布配置，无则返回错误信息
   * - 将入参 fileData 生成临时文件
   * - 将文件 scp 至查询出来的发布地址，文件名为 fileName
   * - 更新 apiauthId lastInvokeTime
   * @param param
   * @returns
   */
  async publishAirlineConfig({
    apiKey,
    airline,
    environment,
    fileData,
    fileName,
  }: AirlineConfigPublishDto) {
    const apiauthId = await this.checkApiAuth(apiKey);
    const publishList =
      await this.airlinePublishService.findActivePublishServerBy(
        airline,
        environment,
      );
    if (!publishList.length) throw new Error('没有查询到相关的航司发布配置');

    try {
      fs.accessSync(this._nidleConfig.tempfile);
    } catch (err) {
      fs.mkdirSync(this._nidleConfig.tempfile, { recursive: true });
    }

    const timestamp = Date.now();
    const tempFilePath = `${this._nidleConfig.tempfile}/${apiauthId}_${timestamp}_${fileName}`;
    fs.writeFileSync(tempFilePath, fileData);

    const res = { succeed: [], failed: [] };
    for (const airlinePublish of publishList) {
      const destPath = path.resolve(
        airlinePublish.projectServerOutput,
        airlinePublish.relativePath,
      );
      try {
        const client = await Client({
          host: airlinePublish.Server.ip,
          port: 22,
          username: airlinePublish.Server.username,
          password: airlinePublish.Server.password,
        });
        const isPathExist = await client.exists(destPath);
        if (!isPathExist) {
          await client.mkdir(destPath);
        }
        await client.uploadFile(tempFilePath, `${destPath}/${fileName}`);
        client.close(); // remember to close connection after you finish
        res.succeed.push(airlinePublish.id);
      } catch (_err) {
        const err = _err || {};
        this.logger.error(
          `publishAirlineConfig failed: airlinePublish id [${airlinePublish.id}]`,
          {
            targetIp: airlinePublish.Server.ip,
            targetPath: `${destPath}/${fileName}`,
            err: JSON.stringify(err, Object.getOwnPropertyNames(err), 2),
          },
        );
        res.failed.push(airlinePublish.id);
      }
    }

    await this.apiauthService.update({
      id: apiauthId,
      lastInvokeTime: new Date(timestamp),
    });
    return res;
  }
}
