import express from 'express'
import { Create, List, Search, Delete, Login } from '../DAO/UserDAO.js'
import query from '../query.js'

const router = express.Router()

router.post('/login', Login)

router.get('/', List)
router.get('/:id', Search)
router.put('/', Create)
router.delete('/:id', Delete)
router.post('/query', query)


export default router
