import colors from 'colors'
import { createSocket } from 'dgram'

export default async function(port) {
  return new Promise((resolve, reject) => {
    const udp = createSocket('udp4')

    udp.on('error', err => {
      console.log('Error:')
      console.log(err)
      console.log(err.stack)
      udp.close()
      reject(err)
    })

    udp.on('listening', () => {
      const address = udp.address()
      console.log(
        `\n⚡️  OSC Debugger server connected to ${address.address}:${
          address.port
        }`.yellow.bold
      )
      resolve(udp)
    })

    udp.bind(port)
  })
}
