import express from 'express'
import { saveInstance, listInstances, listInstancesBySection, findInstance, deleteInstance } from '../BLL/CategoryBLL.js'

const router = express.Router()

router.get('/', listInstances)
router.get('/listbysection/:id', listInstancesBySection)
router.get('/:id', findInstance)
router.put('/', saveInstance)
router.delete('/:id', deleteInstance)

export default router
