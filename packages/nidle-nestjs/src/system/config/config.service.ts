import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService as NestConfigService, ConfigType } from '@nestjs/config';
import * as path from 'path';
import * as requireFromString from 'require-from-string';
import * as extend from 'extend';
import { isEmpty, isFunction } from 'lodash';
import * as NidleChain from 'nidle-chain';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { GitlabService } from 'src/lib/gitlab.service';
import { nidleConfig } from 'src/configuration';
import * as inputParse from 'src/utils/inquirer';
import { TemplateService } from '../template/template.service';
import { AppConfigParam, AppPublishConfigParam } from './config.dto';
import { ProjectService } from '../project/project.service';

@Injectable()
export class ConfigService {
  _nidleConfig: ConfigType<typeof nidleConfig>;
  constructor(
    private readonly gitlabService: GitlabService,
    private readonly templateService: TemplateService,
    private readonly nestConfigService: NestConfigService,
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {
    this._nidleConfig = this.nestConfigService.get('nidleConfig');
  }

  async getAppConfig({
    id: projectId,
    projectObj,
    mode,
    type,
    branch = 'master',
    isNew,
  }: AppConfigParam) {
    let _project = projectObj;
    if (!_project || Object.keys(_project).length === 0) {
      if (!projectId) {
        throw new Error('getAppConfig 缺少参数: [project(Id)/projectObj]');
      }
      _project = await this.projectService.findOne({ id: projectId });
    }

    const { gitlabId, repositoryType /** repositoryUrl */ } = _project;
    const fileName = `nidle.${mode}.config.js`;
    let configStr = '';
    if (repositoryType === 'gitlab') {
      configStr = await this.gitlabService
        .getFile(gitlabId, branch, fileName)
        .catch((err) => {
          if (err.message.includes('404')) {
            // 如果是文件没找到，说明该应用没有在此环境的发布配置，特殊处理，不抛出错误
            return '';
          } else {
            throw err;
          }
        });
    } else {
      /** @todo github */
      // configStr = await this.githubService.getFile(repositoryUrl, branch, fileName);
    }
    if (!configStr) return '';

    let config = requireFromString(configStr);
    try {
      if (typeof config === 'function') {
        config = config({ type, isNew });
      }
    } catch (error) {
      this.logger.error('nidle config function error.', { error });
      throw error;
    }

    if (config.extend) {
      const template = await this.templateService.findOneBy({
        name: config.extend,
      });
      if (template) {
        const templateConfig = JSON.parse(template.config);
        if (!isEmpty(templateConfig)) {
          // 合并模板
          // TODO: 这个合并有点粗暴，没有考虑 stages 扩展的情况，只能在 chain 中扩展
          config = extend(true, {}, templateConfig, config);
        }
      }
    }
    // 有chain，处理chain
    if (config.chain && isFunction(config.chain)) {
      const chainFun = config.chain;
      delete config.chain;

      const newConfig = new NidleChain();
      newConfig.merge(config);
      chainFun(newConfig);
      config = newConfig.toConfig();
    }
    return config;
  }

  async getAppPublishConfig({
    project: projectId,
    projectObj,
    mode,
    type,
    branch,
    isNew,
    fileName: projectPublishFileKey,
  }: AppPublishConfigParam) {
    const config = await this.getAppConfig({
      id: projectId,
      projectObj,
      mode,
      type,
      branch,
      isNew,
    });
    if (!config) {
      // 没有配置，说明该应用没有在此环境的发布配置
      return '';
    }

    if (isNew) {
      // 处理细节output
      config.source = path.resolve(
        this._nidleConfig.source,
        config.source || config.name,
        projectPublishFileKey,
      );

      if (config.output) {
        config.output.path = path.resolve(
          this._nidleConfig.output.path,
          config.output.path || config.name,
          projectPublishFileKey,
        );

        if (config.output.backup) {
          config.output.backup = {
            ...config.output.backup,
            path: path.resolve(
              this._nidleConfig.output.backup.path,
              config.output.backup.path || config.name,
            ),
          };
        } else {
          config.output.backup = {
            path: path.resolve(
              this._nidleConfig.output.backup.path,
              config.name,
            ),
          };
        }
      } else {
        config.output = {
          path: path.resolve(
            this._nidleConfig.output.path,
            config.name,
            projectPublishFileKey,
          ),
          backup: {
            path: path.resolve(
              this._nidleConfig.output.backup.path,
              config.name,
            ),
          },
        };
      }
    }

    // 处理细节log
    let logPath: string;
    if (config.log) {
      logPath = path.resolve(
        this._nidleConfig.log.path,
        config.log.path || config.name,
      );
    } else {
      logPath = path.resolve(this._nidleConfig.log.path, config.name);
    }

    config.log = {
      ...config.log,
      path: logPath,
      all: path.join(logPath, `all_${mode}_${projectPublishFileKey}.log`),
      error: path.join(logPath, `error_${mode}_${projectPublishFileKey}.log`),
    };

    // 有chain，处理chain
    if (config.chain && isFunction(config.chain)) {
      const chainFun = config.chain;
      delete config.chain;

      const newConfig = new NidleChain();
      newConfig.merge(config);
      chainFun(newConfig);
      return newConfig.toConfig();
    }

    return config;
  }

  // 获取配置
  getInput(inputs = [], values, source = 'web') {
    if (source === 'CLI' || !inputs.length) {
      return inputs;
    }
    return inputParse.parse(inputs, values);
  }

  setInput(values, groups, notTransform) {
    return inputParse.transform(values, groups, notTransform);
  }
}
