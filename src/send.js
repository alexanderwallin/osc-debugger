/* eslint no-constant-condition: 0 */
/* eslint no-await-in-loop: 0 */
import colors from 'colors'
import inquirer from 'inquirer'
import osc from 'osc-min'

import createSocket from './createSocket.js'

inquirer.registerPrompt('command', require('inquirer-command-prompt'))

function parseInputValue(value) {
  if (/^"[^"]+"$/.test(value) === true) {
    return value.toString().substr(1, value.length - 2)
  } else if (/\./.test(value)) {
    return parseFloat(value)
  }

  return parseInt(value)
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

export default async function send({ port, address = null }) {
  try {
    const socket = await createSocket()

    let receiverIp = address
    if (receiverIp === null) {
      const input = await inquirer.prompt([
        {
          type: 'input',
          name: 'address',
          message: 'What IP address do you want to send to?',
          default: '0.0.0.0',
        },
      ])
      receiverIp = input.address
    }

    console.log(
      `\n⚡️  Sending OSC messages to ${receiverIp}:${port}\n`.yellow.bold
    )
    console.log(`Use the following format to send messages:`.yellow)
    console.log(`<address> <value>\n`)
    console.log(` - <address> is written out plain and simple`.gray)
    console.log(
      ` - <value> is either a number or a string wrapped in double quotes\n`
        .gray
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

      const [oscAddress, rawValue] = input.split(' ')
      const value = parseInputValue(rawValue)
      const message = osc.toBuffer({
        address: oscAddress,
        args: [value],
      })
      await sendMessage(socket, message, port, receiverIp)
    }
  } catch (err) {
    throw err
  }
}
