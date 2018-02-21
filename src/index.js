#!/usr/bin/env node
/* eslint no-unused-expressions: 0 */
import { prompt } from 'inquirer'
import yargs from 'yargs'

import packageInfo from '../package.json'
import monitor from './monitor.js'
import send from './send.js'

const Task = {
  MONITOR: 'MONITOR',
  SEND: 'SEND',
}

async function runInteractive() {
  const { task, port } = await prompt([
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
  ])

  if (task === Task.MONITOR) {
    await monitor({ port })
  } else if (task === Task.SEND) {
    await send({ port })
  } else {
    throw new TypeError(`Unknown task: ${task}`)
  }
}

// Setup CLI
yargs
  .command(
    'monitor [options]',
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
    'send [options]',
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
    '*',
    `Launch in interactive mode`,
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
  .alias('h', 'help').argv
