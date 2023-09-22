import * as fs from 'fs';
import { FindOptionsWhere, Like } from 'typeorm';
import * as dayjs from 'dayjs';

import _const from 'src/const';
import { SessionDto } from 'src/common/base.dto';

export function getSessionUser(session: SessionDto) {
  if (session.user) return session.user;
  /** @todo customer error */
  throw new Error('请先登录');
}

export function formatPageParams(page: unknown, pageSize: unknown) {
  let [_page, _pageSize] = [Number(page), Number(pageSize)];
  if (isNaN(_page) || _page < 1) {
    _page = 1;
  }

  if (isNaN(_pageSize) || _pageSize < 1) {
    _pageSize = _const.defaultPageSize;
  }
  return { page: _page, pageSize: _pageSize };
}

/**
 * 检查某 value 是否为 undefined
 * 应用: where 条件字段为 undefined 时，会默认去除该条件
 * where 无条件时，会默认返回第一条数据
 * @param val
 * @param msg
 */
export function checkValue(val: unknown, msg?: string) {
  if (val === undefined) {
    throw new Error(msg + `:value should not be undefined`);
  }
}

/**
 * 组装 where 条件
 *
 * 判断字段值是否有效 `(val !== undefined && val !== '')`
 */
export function buildEqualWhere<T extends object>(param: FindOptionsWhere<T>) {
  const _where: FindOptionsWhere<T> = {};
  Object.entries(param).forEach(([k, v]) => {
    if (v !== undefined && v !== '') _where[k] = v;
  });
  return _where;
}

/**
 * 组装 Like where 条件
 */
export function buildLikeWhere<T extends object>(param: Partial<T>) {
  const _where: FindOptionsWhere<T> = {};
  Object.entries(param).forEach(([k, v]) => {
    if (v !== undefined && v !== '') _where[k] = Like(`${v}%`);
  });
  return _where;
}

export function asyncWait(time = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export function readConfig(path: string) {
  const configRaw = fs.readFileSync(path);
  return JSON.parse(configRaw.toString());
}
export function writeConfig(path: string, data: Record<string, any>) {
  fs.writeFileSync(path, JSON.stringify(data, undefined, 2));
}

export function renameFileToBak(path: string) {
  fs.renameSync(path, path + '.bak');
}

export function getFormatNow() {
  return dayjs().format('YYYY-MM-DD HH:mm:ss');
}
