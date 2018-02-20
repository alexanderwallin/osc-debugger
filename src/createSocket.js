import { createSocket } from 'dgram'

export default function(port) {
  const udp = createSocket('udp4')

  udp.on('error', err => {
    console.log('Error:')
    console.log(err)
    console.log(err.stack)
    udp.close()
  })

  udp.on('listening', () => {
    const address = udp.address()
    console.log(
      `OSC Debugger server listening on ${address.address}:${address.port}`
    )
  })

  udp.bind(port)

  return udp
}
