import osc from 'osc-min'
import colors from 'colors'

import createSocket from './createSocket.js'

export default async function monitor({ port, address }) {
  try {
    const socket = await createSocket(port, address)

    socket.on('message', buffer => {
      const message = osc.fromBuffer(buffer)
      if (message.args[0]) {
        console.log(
          `${`[${port}]`.gray} ${message.address.padEnd(30).yellow} ${colors.cyan(
            message.args[0].value
          )} (${message.args[0].type.white})`
        )
      } else {
        // no payload
        console.log(
          `${`[${port}]`.gray} ${message.address.padEnd(30).yellow} (${"null".white})`
        )
      }
    })

    console.log(`Now go send some OSC messages to this address...`.gray)
  } catch (err) {
    throw err
  }
}
