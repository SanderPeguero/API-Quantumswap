import express from "express"
import cors from 'cors'
//importamos nuestro enrutador
import ProductoRoutes from './Routes/ProductRoutes.js'
import UserRoutes from './Routes/UserRoutes.js'
import ShoppingCartRoutes from './Routes/ShoppingCartRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/products', ProductoRoutes)
app.use('/users', UserRoutes)
app.use('/shoppingcarts', ShoppingCartRoutes)

app.get('/', (req, res) => {
    res.send('Welcome to the QuantumSwap API!')
})

app.listen(process.env.PORT || 4000, () => {
    console.log('Server Started!')
})
