import IO from 'koa-socket-2'

const io = new IO()

function socketEmitter(name, content) {
  io.broadcast(name, content)
}

io.on('connection', () => {
  console.log('client connected to socket io')
  socketEmitter('event', 'Hi, Connected to socket IO')
})

io.on('message', (ctx, data) => {
  console.log('client sent data to message endpoint', data)
})


export { io, socketEmitter }
