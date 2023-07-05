import CONST from 'src/const';
import { FindOptionsWhere, Like } from 'typeorm';

export function formatPageParams(page: unknown, pageSize: unknown) {
  let [_page, _pageSize] = [Number(page), Number(pageSize)];
  if (isNaN(_page) || _page < 0) {
    _page = 1;
  }

  if (isNaN(_pageSize) || _pageSize < 1) {
    _pageSize = CONST.defaultPageSize;
  }
  return { page: _page, pageSize: _pageSize };
}

export function buildLikeWhere<T extends object>(
  paramObj: Partial<T>,
  initObj: FindOptionsWhere<T> = {},
) {
  const _where: FindOptionsWhere<T> = { ...initObj };
  Object.entries(paramObj).forEach(([k, v]) => {
    if (v) _where[k] = Like(`${v}%`);
  });
  return _where;
}
