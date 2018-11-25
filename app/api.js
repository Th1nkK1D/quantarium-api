import Koa from 'koa'
import Router from 'koa-router'
import Logger from 'koa-logger'

import { Qubit, BasicGate } from '../../quantarium-qsim/lib'

const api = new Koa()
const router = new Router()

let q = new Qubit()

function getErrorResBody(msg) {
  return {
    error: true,
    msg: msg
  }
}

/**
 * @swagger
 * definition:
 *  composer-state:
 *    properties:
 *      isCollapsed:
 *        type: boolean
 *      state:
 *        type: array
 *        items:
*           $ref: '#/definitions/state'
 *      gates:
 *        $ref: '#/definitions/gates'
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
 *  state:
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
  ctx.status = 200
  ctx.body = {
    msg: 'Welcome to Quantarium Composer API'
  }
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
  ctx.status = 200
  ctx.body = q.getQubitSummary()
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
  
  ctx.status = 200
  ctx.body = q.reset()
})

/**
 * @swagger
 * /gate/{gate-symbol}:
 *   get:
 *     tags:
 *       - Gate Operation
 *     description: Preview gate result
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Next qubit state
 *         schema:
 *           $ref: '#/definitions/state'
 */
router.get('/gate/:gateSymbol', async (ctx, next) => {
  await next()

  const gate = ctx.params.gateSymbol ? ctx.params.gateSymbol.toUpperCase() : false

  if (!(gate in BasicGate)) {
    ctx.status = 400
    ctx.body = getErrorResBody('Gate not available')
  } else if (q.collapsed !== false) {
    ctx.status = 400
    ctx.body = getErrorResBody('Qubit is collapsed')
  } else {
    ctx.status = 200
    ctx.body = {
      state: q.calculateOperation(BasicGate[gate].operation).map(z => z.toString())
    }
  }

})

/**
 * @swagger
 * /gate/{gate-symbol}:
 *   put:
 *     tags:
 *       - Gate Operation
 *     description: Apply gate to the qubit
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Composer state
 *         schema:
 *           $ref: '#/definitions/composer-state'
 */
router.put('/gate/:gateSymbol', async (ctx, next) => {
  await next()

  const gate = ctx.params.gateSymbol ? ctx.params.gateSymbol.toUpperCase() : false

  if (!(gate in BasicGate)) {
    ctx.status = 400
    ctx.body = getErrorResBody('Gate is not available')
  } else {
    const opRes = q.pushGates([BasicGate[gate]])

    if (!opRes) {
      ctx.status = 400
      ctx.body = getErrorResBody('Qubit is collapsed')
    } else {
      ctx.status = 200
      ctx.body = opRes
    }
  }

})

/**
 * @swagger
 * /gate/{gate-symbol}:
 *   delete:
 *     tags:
 *       - Gate Operation
 *     description: Remove last applied gate from the qubit
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Composer state
 *         schema:
 *           $ref: '#/definitions/composer-state'
 */
router.delete('/gate/', async (ctx, next) => {
  await next()

  const opRes = q.popGates()

  if (!opRes) {
    ctx.status = 400
    ctx.body = getErrorResBody('Qubit is collapsed')
  } else {
    ctx.status = 200
    ctx.body = opRes
  }

})

/**
 * @swagger
 * /measure/{batch-size}:
 *   post:
 *     tags:
 *       - Measurement
 *     description: Measure the qubit
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Measurement result
 *         schema:
 *           $ref: '#/definitions/measurement'
 */
router.post('/measure/:batchSize', async (ctx, next) => {
  await next()

  const opRes = q.measure(ctx.params.batchSize)

  if (!opRes) {
    ctx.status = 400
    ctx.body = getErrorResBody('Qubit is collapsed')
  } else {
    ctx.status = 200
    ctx.body = opRes
  }

})

/**
 * @swagger
 * /unmeasure:
 *   post:
 *     tags:
 *       - Measurement
 *     description: Undo measurement
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Composer state
 *         schema:
 *           $ref: '#/definitions/composer-state'
 */
router.post('/unmeasure/', async (ctx, next) => {
  await next()

  const opRes = q.unmeasure()

  if (!opRes) {
    ctx.status = 400
    ctx.body = getErrorResBody('No measurement was applied')
  } else {
    ctx.status = 200
    ctx.body = opRes
  }

})

api.use(Logger())
api.use(router.routes())
api.use(router.allowedMethods())

export default api