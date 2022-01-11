import { Form } from 'antd'
import { BetaSchemaForm } from '@ant-design/pro-form'
import inputParse, { getGroupValues } from '@/utils/inquirer'

const Input = props => {
  const [form] = Form.useForm()
  const { inputs: input } = props
  let schema

  if (input) {
    try {
      schema = inputParse(input)
      handleValidate(schema.columns)
    } catch (err) {
      throw err
    }
  }

  function handleValidate(columns = []) {
    columns.forEach(column => {
      if (column.columns) {
        handleValidate(column.columns)
        return
      }

      if (column.validate) {
        const validator = column.validate

        column.formItemProps.rules.push({
          validator: (rule, value) => {
            // 为了避免多个插件中input key冲突，所以都加上了stage.step.key
            // 但是input的校验中却还保留原始key，所以需要处理
            const values = form.getFieldsValue(true)
            const validate = validator(value, getGroupValues(values, rule.field))

            if (validate === true) {
              return Promise.resolve()
            }

            return Promise.reject(new Error(validate))
          }
        })
      }
    })
  }

  function submit(values) {
    props.onFinish(values)
  }

  return (
    schema && (
      <BetaSchemaForm
        form={form}
        {...schema}
        onFinish={values => {
          submit(values)
        }}
      ></BetaSchemaForm>
    )
  )
}

export default Input
