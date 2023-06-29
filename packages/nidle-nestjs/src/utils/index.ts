import CONST from 'src/const';

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
