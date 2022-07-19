import express from 'express'
import { saveInstance, listInstances, listInstancesByCategory, findInstance, deleteInstance } from '../BLL/ProductBLL.js'

const router = express.Router()

router.get('/', listInstances)
router.get('/listbycategory/:id', listInstancesByCategory)
router.get('/:id', findInstance)
router.put('/', saveInstance)
router.delete('/:id', deleteInstance)

export default router
