const list = {
  props: ['type', 'name', 'message', 'choices', 'default', 'filter', 'loop', 'when'],
  required: ['type', 'name', 'message', 'choices']
}

const rawlist = {
  props: ['type', 'name', 'message', 'choices', 'default', 'filter', 'loop', 'when'],
  required: ['type', 'name', 'message', 'choices']
}

const expand = {
  props: ['type', 'name', 'message', 'choices', 'default', 'when'],
  required: ['type', 'name', 'message', 'choices']
}

// TODO: checbox choices 还比其他多字段 checked、disabled
const checkbox = {
  props: ['type', 'name', 'message', 'choices', 'default', 'filter', 'loop', 'validate', 'when'],
  required: ['type', 'name', 'message', 'choices']
}

const confirm = {
  props: ['type', 'name', 'message', 'default', 'when'],
  required: ['type', 'name', 'message']
}

const input = {
  props: ['type', 'name', 'message', 'default', 'filter', 'validate', 'transformer', 'when'],
  required: ['type', 'name', 'message']
}

const number = {
  props: ['type', 'name', 'message', 'default', 'filter', 'validate', 'transformer', 'when'],
  required: ['type', 'name', 'message']
}

const password = {
  props: ['type', 'name', 'message', 'mask', 'default', 'filter', 'validate', 'when'],
  required: ['type', 'name', 'message']
}

// 暂时不支持
// exports.editor = {
//   props: [
//     'type',
//     'name',
//     'message',
//     'default',
//     'filter',
//     'validate',
//     'postfix'
//   ],
//   required: [
//     'type',
//     'name',
//     'message'
//   ]
// }

export default {
  list,
  rawlist,
  expand,
  checkbox,
  confirm,
  input,
  number,
  password
}
