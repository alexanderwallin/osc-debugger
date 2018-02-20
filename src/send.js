/* eslint no-constant-condition: 0 */
/* eslint no-await-in-loop: 0 */
import colors from 'colors'
import inquirer from 'inquirer'
import osc from 'osc-min'

import createSocket from './createSocket.js'

inquirer.registerPrompt('command', require('inquirer-command-prompt'))

function parseInputValue(value) {
  if (/^".+"$/.test(value) === true) {
    return value
  } else if (/\./.test(value)) {
    return parseFloat(value)
  } else {
    return parseInt(value)
  }
}

async function sendMessage(socket, message, port) {
  return new Promise((resolve, reject) => {
    socket.send(message, 0, message.length, port, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export default async function send(port) {
  try {
    const socket = await createSocket()

    console.log(`\nUse the following format to send messages:\n`.yellow.bold)
    console.log(`<address> <value>\n`)
    console.log(`<address> is written out plain and simple`.gray)
    console.log(
      `<value> is either a number or a string wrapped in double quotes\n`.gray
    )
    console.log(`Example: /light/1/color "red"`.gray)

    while (true) {
      const { input } = await inquirer.prompt([
        {
          type: 'command',
          name: 'input',
          message: '>',
        },
      ])

      const [address, rawValue] = input.split(' ')
      const value = parseInputValue(rawValue)
      const message = osc.toBuffer({
        address,
        args: [value],
      })
      await sendMessage(socket, message, port)
    }
  } catch (err) {
    throw err
  }
}
