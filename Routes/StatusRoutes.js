import express from 'express'
import { saveInstance, listInstances, findInstance, deleteInstance } from '../BLL/StatusBLL.js'

const router = express.Router()

router.get('/', listInstances)
router.get('/:id', findInstance)
router.put('/', saveInstance)
router.delete('/:id', deleteInstance)

export default router
