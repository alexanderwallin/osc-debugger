#!/usr/bin/env node
import { prompt } from 'inquirer'

import monitor from './monitor.js'
import send from './send.js'

const Task = {
  MONITOR: 'MONITOR',
  SEND: 'SEND',
}

async function run() {
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
    await monitor(port)
  } else if (task === Task.SEND) {
    await send(port)
  } else {
    throw new TypeError(`Unknown task: ${task}`)
  }
}

run().catch(err => {
  console.log('An error occured:')
  console.log(err)
  console.log(err.stack)
})
