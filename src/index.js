#!/usr/bin/env node
/* eslint prefer-template: 0 */
import colors from 'colors'
import { prompt } from 'inquirer'
import yargonaut from 'yargonaut'
import yargs from 'yargs'

import packageInfo from '../package.json'
import monitor from './monitor.js'
import send from './send.js'

yargonaut.style('blue')

const Task = {
  MONITOR: 'MONITOR',
  SEND: 'SEND',
}

async function runInteractive() {
  const { task, port, address } = await prompt([
    {
      type: 'list',
      name: 'task',
      message: 'What do you want to do?',
      choices: [
        { value: Task.MONITOR, name: 'Monitor OSC messages' },
        { value: Task.SEND, name: 'Send OSC messages' },
      ],
    },
    {
      type: 'input',
      name: 'port',
      message: 'What port do you want to connect to?',
      default: 666,
      filter: value => parseInt(value),
    },
    {
      type: 'input',
      name: 'address',
      message: 'What host IP do you want to connect to?',
      default: '0.0.0.0',
    },
  ])

  if (task === Task.MONITOR) {
    await monitor({ port, address })
  } else if (task === Task.SEND) {
    await send({ port, address })
  } else {
    throw new TypeError(`Unknown task: ${task}`)
  }
}

// Setup CLI
yargs
  .usage(
    `OSC Debugger\n\n`.yellow.bold +
      `A simple but charming OSC debugging tool for the terminal. Runs in interactive mode if no command is specified.`
  )
  .command(
    'monitor [options...]',
    'Monitor OSC messages',
    {
      port: {
        alias: 'p',
        default: '8888',
        demandOption: true,
        describe: 'The port you want to listen to',
      },
    },
    async ({ port }) => {
      await monitor({ port })
    }
  )
  .command(
    'send [options...]',
    'Send OSC messages',
    {
      address: {
        alias: 'a',
        default: '0.0.0.0',
        describe: 'The IP address you want to send to',
      },
      port: {
        alias: 'p',
        default: '8888',
        demandOption: true,
        describe: 'The port you want to send to',
      },
    },
    ({ port, address }) => {
      send({ port, address })
    }
  )
  .command(
    '$0',
    false,
    () => {},
    () => {
      runInteractive().catch(err => {
        console.log('An error occured:')
        console.log(err)
        console.log(err.stack)
      })
    }
  )
  .version(packageInfo.version)
  .help()
  .alias('h', 'help')
  .parse()
