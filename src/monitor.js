import osc from 'osc-min'
import colors from 'colors'

import createSocket from './createSocket.js'

export default function monitor(port) {
  const socket = createSocket(port)

  socket.on('message', buffer => {
    const message = osc.fromBuffer(buffer)
    console.log(
      `${`[${port}]`.gray} ${message.address.padEnd(30).yellow} ${colors.cyan(
        message.args[0].value
      )} (${message.args[0].type.white})`
    )
  })
}
