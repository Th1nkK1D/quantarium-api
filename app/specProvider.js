import swaggerJSDoc from 'swagger-jsdoc'

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Quantarium Composer API',
      version: '1.0.0',
      description: 'Server-side API for Quantarium, an interactive quantum computing exhibition',
    },
    host: 'localhost:3000',
    basePath: '/api',
  },
  apis: ['./app/api.js'],
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

async function serveSwaggerSpec(ctx, next) {
  await next()
  ctx.body = swaggerSpec
}

export default serveSwaggerSpec