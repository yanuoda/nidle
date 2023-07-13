import fs from 'fs';

import _const from 'src/const';
import { FindOptionsWhere, Like } from 'typeorm';

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
    if (v) _where[k] = Like(`${v}%`);
  });
  return _where;
}
