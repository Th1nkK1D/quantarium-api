import fs from 'fs'
import Koa from 'koa'
import serve from 'koa-static'
import mount from 'koa-mount'
import SwaggerUI from 'swagger-ui-dist'

import serveSwaggerSpec from './specProvider'
import api from './api'
import { io } from './socket'

const pathToSwaggerUi = SwaggerUI.absolutePath()

const PORT = 3000
const SPEC_PATH = '/spec.json'

// Replace default swagger URL if needed
const swaggerIndex = fs.readFileSync(`${pathToSwaggerUi}/index.html`).toString()
  .replace('https://petstore.swagger.io/v2/swagger.json', 'http://localhost:'+PORT+SPEC_PATH)

fs.writeFile(`${pathToSwaggerUi}/index.html`, swaggerIndex, err => {
  if (err) {
    console.log(err)
  }
})

// Init Koa app
const app = new Koa()

io.attach(app)

app.use(mount(SPEC_PATH, serveSwaggerSpec))
app.use(mount('/doc', serve(pathToSwaggerUi)))
app.use(mount('/api', api))

app.listen(3000)

console.log('Listening on port 3000')
