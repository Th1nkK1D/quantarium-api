import Koa from 'koa'
import Router from 'koa-router'
import Logger from 'koa-logger'

const api = new Koa()
const router = new Router()

/**
 * @swagger
 * definition:
 *  composer-state:
 *    properties:
 *      isCollapsed:
 *        type: boolean
 *      gates:
 *        $ref: '#/definitions/gates'
 *      measurement:
 *        $ref: '#/definitions/measurement'
 */

/**
 * @swagger
 * definition:
 *  gates:
 *    type: array
 *    items:
 *      type: string 
 */

/**
 * @swagger
 * definition:
 *  measurement:
 *    properties:
 *      batchSize:
 *        type: number
 *      result:
 *        type: array
 *        items:
 *          type: number
 */

router.get('/', async (ctx, next) => {
  await next()
  ctx.body = 'Welcome to Quantarium Composer API'
})

/**
 * @swagger
 * /init:
 *   post:
 *     tags:
 *       - Common
 *     description: Initialize composer
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Composer state
 *         schema:
 *           $ref: '#/definitions/composer-state'
 */
router.post('/init', async (ctx, next) => {
  await next()
  ctx.body = {}
})

/**
 * @swagger
 * /state:
 *   get:
 *     tags:
 *       - Common
 *     description: Get composer state
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Composer state
 *         schema:
 *           $ref: '#/definitions/composer-state'
 */
router.get('/state', async (ctx, next) => {
  await next()
  ctx.body = {}
})

/**
 * @swagger
 * /reset:
 *   post:
 *     tags:
 *       - Common
 *     description: Reset composer state
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Composer state
 *         schema:
 *           $ref: '#/definitions/composer-state'
 */
router.post('/reset', async (ctx, next) => {
  await next()
  ctx.body = {}
})

api.use(Logger())
api.use(router.routes())
api.use(router.allowedMethods())

export default api