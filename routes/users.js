import express from 'express'
import { saveInstance, listInstances, findInstance, deleteInstance, findInstanceByEmail } from '../BLL/UserBLL.js'
import query from '../query.js'

const router = express.Router()

router.post('/login', findInstanceByEmail)

router.get('/', listInstances)
router.get('/:id', findInstance)
router.put('/', saveInstance)
router.delete('/:id', deleteInstance)
router.post('/query', query)


export default router
