const Koa = require('koa')
const serve = require('koa-static')
const mount = require('koa-mount')
const pathToSwaggerUi = require('swagger-ui-dist').absolutePath()

async function api(ctx, next){
  await next();
  ctx.body = 'Hello';
}

const app = new Koa()

app.use(mount('/', serve(pathToSwaggerUi)))
app.use(mount('/api', api))

app.listen(3000);

console.log('Listening on port 3000')
