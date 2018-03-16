import colors from 'colors'
import { createSocket } from 'dgram'

export default async function(port = null, address = null) {
  return new Promise((resolve, reject) => {
    const udp = createSocket('udp4')

    udp.on('error', err => {
      console.log('Error:')
      console.log(err)
      console.log(err.stack)
      udp.close()
      reject(err)
    })

    if (port !== null) {
      udp.on('listening', () => {
        const address = udp.address()
        console.log(
          `\n⚡️  OSC Debugger server listening to ${address.address}:${
            address.port
          }`.yellow.bold
        )
        resolve(udp)
      })

      udp.bind(port, address)
    } else {
      resolve(udp)
    }
  })
}
