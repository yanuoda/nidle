import { useContext, useEffect, useState } from 'react'
import { Form, message } from 'antd'
import { BetaSchemaForm } from '@ant-design/pro-form'
import ProProvider from '@ant-design/pro-provider'
import inputParse, { getGroupValues } from '@/utils/inquirer'
import ServerList from './ServerList'

const Input = props => {
  const [form] = Form.useForm()
  const { inputs, readonly } = props
  const [schema, setSchema] = useState()

  useEffect(() => {
    try {
      const schema = inputParse(inputs, readonly)

      setSchema(schema)
      handleValidate(schema.columns)
    } catch (err) {
      throw err
    }
  }, [inputs, readonly])

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

  function handlerSubmit() {
    form
      .validateFields()
      .then(values => {
        props.onChange(values)
        message.success('Inputs配置已保存，可以开始发布任务！')
      })
      .catch(() => {
        props.onChange(null)
      })
  }

  const values = useContext(ProProvider)

  return schema ? (
    <ProProvider.Provider
      value={{
        ...values,
        valueTypeMap: {
          servers: ServerList
        }
      }}
    >
      <BetaSchemaForm
        form={form}
        {...schema}
        submitter={{
          searchConfig: {
            submitText: '保存'
          },
          onSubmit: () => {
            handlerSubmit()
          },
          resetButtonProps: {
            style: {
              display: 'none'
            }
          },
          submitButtonProps: {
            style: {
              display: readonly ? 'none' : 'block'
            }
          }
        }}
      ></BetaSchemaForm>
    </ProProvider.Provider>
  ) : null
}

export default Input
