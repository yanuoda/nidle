import { useRequest } from 'umi'
import { Form, Button } from 'antd'
import { PageContainer } from '@ant-design/pro-layout'
import { BetaSchemaForm } from '@ant-design/pro-form'
import { getInput, setInput, start } from '@/services/config'
import inputParse, { getGroupValues } from '@/utils/inquirer'

const Input = () => {
  const [form] = Form.useForm()
  const { data: input, loading } = useRequest(() => {
    return getInput({
      id: 'input'
    })
  })
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

  async function submit(values) {
    console.log(2222, values)
    await setInput({
      values,
      groups: input
    })
  }

  async function onStart() {
    try {
      await start({})
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <PageContainer>
      {loading && 'loading...'}
      {schema && (
        <BetaSchemaForm
          form={form}
          {...schema}
          onFinish={values => {
            submit(values)
          }}
        ></BetaSchemaForm>
      )}
      <Button onClick={() => onStart()}>发布</Button>
    </PageContainer>
  )
}

export default Input
