const inquirer = require('inquirer')
const requireLetterAndNumber = value => {
  if (/^[\w|\d]{6,12}$/.test(value)) {
    return true
  }
  return '密码由6-12位字母或数字组成'
}

exports.input = [
  {
    stage: 'build',
    step: 'download',
    plugin: 'download',
    description: '下载',
    input: [
      {
        type: 'input',
        name: 'first_name',
        message: "What's your first name"
      },
      {
        type: 'input',
        name: 'last_name',
        message: "What's your last name",
        default: 'Doe'
      }
    ]
  },
  {
    stage: 'build',
    step: 'lint',
    plugin: 'shell',
    input: [
      {
        type: 'input',
        name: 'shell',
        message: 'Enter your shell'
      }
    ]
  },
  {
    stage: 'build',
    step: 'build',
    plugin: 'shell',
    input: [
      {
        type: 'input',
        name: 'shell',
        message: 'Enter your shell'
      }
    ]
  },
  {
    stage: 'publish',
    step: 'publish',
    plugin: 'publish',
    input: [
      {
        type: 'input',
        name: 'phone',
        message: "What's your phone number",
        validate: function (value) {
          var pass = value.match(/^1[3|4|5|6|7|8|9]\d{9}$/)
          if (pass) {
            return true
          }

          return 'Please enter a valid phone number'
        }
      },
      {
        type: 'password',
        message: 'Enter a password',
        name: 'password1',
        validate: requireLetterAndNumber
      },
      {
        type: 'password',
        message: 'Enter a masked password',
        name: 'password2',
        mask: '*',
        validate: function (value, answer) {
          if (!/^[\w|\d]{6,12}$/.test(value)) {
            return '密码由6-12位字母或数字组成'
          }

          if (value !== answer.password1) {
            return '两次密码必须一致'
          }

          return true
        }
      },
      {
        type: 'number',
        message: '总价',
        name: 'total'
      },
      {
        type: 'checkbox',
        message: 'Select toppings',
        name: 'toppings',
        choices: [
          new inquirer.Separator(' = The Meats = '),
          {
            name: 'Pepperoni'
          },
          {
            name: 'Ham'
          },
          {
            name: 'Ground Meat'
          },
          {
            name: 'Bacon'
          },
          new inquirer.Separator(' = The Cheeses = '),
          {
            name: 'Mozzarella',
            checked: true
          },
          {
            name: 'Cheddar'
          },
          {
            name: 'Parmesan'
          },
          new inquirer.Separator(' = The usual ='),
          {
            name: 'Mushroom'
          },
          {
            name: 'Tomato'
          },
          new inquirer.Separator(' = The extras = '),
          {
            name: 'Pineapple'
          },
          {
            name: 'Olives',
            disabled: 'out of stock'
          },
          {
            name: 'Extra cheese'
          }
        ],
        default: ['Mozzarella'],
        validate: function (answer) {
          if (answer.length < 1) {
            return 'You must choose at least one topping.'
          }
          return true
        }
      },
      {
        type: 'list',
        name: 'theme',
        message: 'What do you want to do?',
        choices: [
          'Order a pizza',
          'Make a reservation',
          new inquirer.Separator(),
          'Ask for opening hours',
          {
            name: 'Contact support',
            disabled: 'Unavailable at this time'
          },
          'Talk to the receptionist'
        ],
        default: 'Order a pizza'
      },
      {
        type: 'expand',
        message: 'Conflict on `file.js`: ',
        name: 'overwrite',
        choices: [
          {
            key: 'y',
            name: 'Overwrite',
            value: 'overwrite'
          },
          {
            key: 'a',
            name: 'Overwrite this one and all next',
            value: 'overwrite_all'
          },
          {
            key: 'd',
            name: 'Show diff',
            value: 'diff'
          },
          new inquirer.Separator(),
          {
            key: 'x',
            name: 'Abort',
            value: 'abort'
          }
        ]
      },
      {
        type: 'rawlist',
        name: 'size',
        message: 'What size do you need',
        choices: ['Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro'],
        filter: function (val) {
          return val.toLowerCase()
        }
      },
      {
        type: 'confirm',
        name: 'toBeDelivered',
        message: 'Is this for delivery?',
        default: false
      }
    ]
  }
]
