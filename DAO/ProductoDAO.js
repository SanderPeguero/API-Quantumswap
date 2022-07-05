//importamos el Modelo
import ProductModel from "../models/ProductModel.js"
//importamos la Conexion
import { ConnectionRestart } from "../Conexion/Conexion.js"

let Conexion = ConnectionRestart()
let SqlQuery = "SELECT ProductId, Description, Stock, Cost, Price, Discount, Image, CreationDate, ModificationDate, Status FROM products "

//** Métodos para el CRUD **/

//obtiene una instancia de un modelo a partir de un registro de una tabla de base de datos
function getInstancia(fila) {
    if (fila == null) {
        return ProductModel
    }

    ProductModel.ProductId = fila.ProductId
    ProductModel.Description = fila.Description
    ProductModel.Stock = fila.Stock
    ProductModel.Cost = fila.Cost
    ProductModel.Price = fila.Price
    ProductModel.Discount = fila.Discount
    ProductModel.Image = fila.Image
    ProductModel.CreationDate = fila.CreationDate
    ProductModel.ModificationDate = fila.ModificationDate
    ProductModel.Status = fila.Status
    
    return ProductModel
}

//guardar datos
export const guardar = async (req, res) => {

    const ProductModel = req.body

    if (ProductModel.ProductId == 0) {
        
        insertar(ProductModel, res)

    } else {
        
        modificar(ProductModel, res)

    }

}

//Crear un registro
function insertar(productModel, res) {
	
    const values = [
        productModel.Description,
        productModel.Stock,
        productModel.Cost,
        productModel.Price,
        productModel.Discount,
        productModel.Image,
        productModel.CreationDate,
        productModel.ModificationDate,
        productModel.Status
    ]
    
    Conexion = ConnectionRestart() 

    Conexion.query("INSERT INTO productos (Description, Stock, Cost, Price, Discount, Image, CreationDate, ModificationDate, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", values,
        
        (err, result) => {
            res.json( !err && result.affectedRows > 0 )
        }

    )

    Conexion.end()
}

//Actualizar un registro
function modificar(productModel, res) {

	const values = [
        productModel.Description,
        productModel.Stock,
        productModel.Cost,
        productModel.Price,
        productModel.Discount,
        productModel.Image,
        productModel.CreationDate,
        productModel.ModificationDate,
        productModel.Status,
        productModel.ProductId
    ]
    
    Conexion = ConnectionRestart() 

    Conexion.query("UPDATE productos SET Description=?, Stock=?, Cost=?, Price=?, Discount=?, Image=?, CreationDate=?, ModificationDate=?, Status=? WHERE ProductId=?", values,
    
        (err, result) => {
            res.json( !err && result.affectedRows > 0 )
        }

    )

    Conexion.end()

}

//Mostrar todos los registros
export const listar = (req, res) => {
    
    Conexion = ConnectionRestart() 

    Conexion.query(SqlQuery, (err, result) => {
        let data = []
        
        for (let i = 0; i < result.length; i++) {
        
            let fila = result[i];
            data.push(Object.assign({}, getInstancia(fila)))
        
        }
        
        return res.json( data )
    })

    // Conexion.destroy()
    Conexion.end()

}

//Mostrar un registro
export const buscar = async (req, res) => {

    const { id } = req.params
	const values = [id]
    
    Conexion = ConnectionRestart() 

    Conexion.query(SqlQuery + " WHERE ProductId = ? ", values, (err, result) => {
        let data = getInstancia(result[0])
        res.json( data )
    })

    Conexion.end()

}

//Eliminar un registro
export const eliminar = (req, res) => {

    const { id } = req.params
	const values = [id]
    
    Conexion = ConnectionRestart() 

    Conexion.query("DELETE FROM productos WHERE ProductId = ? ", values,
    
        (err, result) => {

            res.json( !err && result.affectedRows > 0 )

        }

    )

    Conexion.end()

}