import express from 'express'
import { saveInstance, listInstances, findInstance, deleteInstance } from '../BLL/ShoppingCartBLL.js'

const router = express.Router()

router.get('/', listInstances)
router.get('/:id', findInstance)
router.put('/', saveInstance)
router.delete('/:id', deleteInstance)

export default router
