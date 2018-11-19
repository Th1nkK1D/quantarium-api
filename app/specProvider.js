import swaggerJSDoc from 'swagger-jsdoc'

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Node Swagger API',
      version: '1.0.0',
      description: 'Demonstrating how to describe a RESTful API with Swagger',
    },
    host: 'localhost:3000',
    basePath: '/',
  },
  apis: ['./app/api.js'],
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

async function serveSwaggerSpec(ctx, next) {
  await next()
  ctx.body = swaggerSpec
}

export default serveSwaggerSpec