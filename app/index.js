const fs = require('fs')
const Koa = require('koa')
const serve = require('koa-static')
const mount = require('koa-mount')
const pathToSwaggerUi = require('swagger-ui-dist').absolutePath()

import serveSwaggerSpec from './specProvider'
import api from './api'

const PORT = 3000
const SPEC_PATH = '/spec.json'

// Replace default swagger URL if needed
const swaggerIndex = fs.readFileSync(`${pathToSwaggerUi}/index.html`)
  .toString()
  .replace('https://petstore.swagger.io/v2/swagger.json', 'http://localhost:'+PORT+SPEC_PATH)

fs.writeFile(`${pathToSwaggerUi}/index.html`, swaggerIndex, (err, data) => {
  if (err) console.log(err)
})

// Init Koa app
const app = new Koa()

app.use(mount('/', serve(pathToSwaggerUi)))
app.use(mount(SPEC_PATH, serveSwaggerSpec))
app.use(mount('/api', api))

app.listen(3000)

console.log('Listening on port 3000')
