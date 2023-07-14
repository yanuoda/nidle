import _ from 'lodash';

import _parse from './parse';
import _transform from './transform';

export function parse(inputs = [], values) {
  return _parse(_.cloneDeep(inputs), values);
}

export const transform = _transform;
