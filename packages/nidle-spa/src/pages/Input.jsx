import { useRequest } from 'umi'
import { Form } from 'antd'
import { PageContainer } from '@ant-design/pro-layout'
import { BetaSchemaForm } from '@ant-design/pro-form'
import { getInput } from '@/services/config'
import inputParse from '@/utils/inquirer'

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
      schema.columns.forEach(column => {
        if (column.validate) {
          const validator = column.validate

          column.formItemProps.rules.push({
            validator: (rule, value) => {
              const values = form.getFieldsValue(true)
              const validate = validator(value, values)

              if (validate === true) {
                return Promise.resolve()
              }

              return Promise.reject(new Error(validate))
            }
          })
        }
      })
    } catch (err) {
      throw err
    }
  }

  function submit(values) {
    console.log(2222, values)
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
    </PageContainer>
  )
}

export default Input
