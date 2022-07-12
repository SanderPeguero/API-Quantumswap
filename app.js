import express from "express"
import cors from 'cors'
//importamos nuestro enrutador
import ProductRoutes from './Routes/ProductRoutes.js'
import UserRoutes from './Routes/UserRoutes.js'
import ShoppingCartRoutes from './Routes/ShoppingCartRoutes.js'
import OfferRoutes from './Routes/OfferRoutes.js'
import OfferTypeRoutes from './Routes/OfferTypeRoutes.js'
import SectionRoutes from './Routes/SectionRoutes.js'
import CategoryRoutes from './Routes/CategoryRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/products', ProductRoutes)
app.use('/users', UserRoutes)
app.use('/shoppingcarts', ShoppingCartRoutes)
app.use('/offers', OfferRoutes)
app.use('/offertypes', OfferTypeRoutes)
app.use('/sections', SectionRoutes)
app.use('/categories', CategoryRoutes)

app.get('/', (req, res) => {
    res.send('Welcome to the QuantumSwap API!')
})

app.listen(process.env.PORT || 4000, () => {
    console.log('Server Started!')
})
