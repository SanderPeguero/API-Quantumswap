import express  from "express"
import cors from 'cors'
//importamos nuestro enrutador
import productoRoutes from './routes/products.js'
import userRoutes from './routes/users.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/products', productoRoutes)
app.use('/users', userRoutes)

/*
try {
    await Conexion.authenticate()
    console.log('Conexión exitosa a la DB')
} catch (error) {
    console.log(`El error de conexión es: ${error}`)
}
*/

app.get('/', (req, res)=>{
    res.send('Welcome to the QuantumSwap API!')
})

app.listen( process.env.PORT || 4000, ()=>{
    console.log('Server Started!')
})
