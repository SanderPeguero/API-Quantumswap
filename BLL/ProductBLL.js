//importamos el Modelo
import ProductModel from "../models/ProductModel.js"
//importamos la Connection
import { ConnectionRestart } from "../Connection/Connection.js"

let Connection = ConnectionRestart()
let SqlQuery = "SELECT ProductId, Description, Stock, Cost, Price, Discount, Image, CreationDate, ModificationDate, Status FROM products "

//** Métodos para el CRUD **/

//obtiene una instancia de un modelo a partir de un registro de una tabla de base de datos
function getInstance(row = null) {
    if (row == null) {
        return ProductModel
    }

    ProductModel.ProductId = row.ProductId || 0
    ProductModel.Description = row.Description || ""
    ProductModel.Stock = row.Stock || 0
    ProductModel.Cost = row.Cost || 0
    ProductModel.Price = row.Price || 0
    ProductModel.Discount = row.Discount || 0
    ProductModel.Image = row.Image || ""
    ProductModel.CreationDate = row.CreationDate || ""
    ProductModel.ModificationDate = row.ModificationDate || ""
    ProductModel.Status = row.Status || 0
    
    return ProductModel
}

//save datos
export const saveInstance = async (req, res) => {

    const ProductModel = req.body

    if (ProductModel.ProductId == 0) {
        
        insertInstance(ProductModel, res)

    } else {
        
        updateInstance(ProductModel, res)

    }

}

//Crear un registro
function insertInstance(productModel, res) {
	
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
    
    Connection = ConnectionRestart() 

    Connection.query("INSERT INTO products (Description, Stock, Cost, Price, Discount, Image, CreationDate, ModificationDate, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", values,
        
        (err, result) => {
            res.json( !err && result.affectedRows > 0 )
        }

    )

    Connection.end()
}

//Actualizar un registro
function updateInstance(productModel, res) {

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
    
    Connection = ConnectionRestart() 

    Connection.query("UPDATE products SET Description=?, Stock=?, Cost=?, Price=?, Discount=?, Image=?, CreationDate=?, ModificationDate=?, Status=? WHERE ProductId=?", values,
    
        (err, result) => {
            res.json( !err && result.affectedRows > 0 )
        }

    )

    Connection.end()

}

//Mostrar todos los registros
export const listInstances = (req, res) => {
    
    Connection = ConnectionRestart() 

    Connection.query(SqlQuery, (err, result) => {
        let data = []
        
        for (let i = 0; i < result.length; i++) {
        
            let fila = result[i];
            data.push(Object.assign({}, getInstance(fila)))
        
        }

        if (data.length > 0) {
            res.json( data )
        } else {
            res.status(404).json()
        }
        
    })

    // Connection.destroy()
    Connection.end()

}

//Mostrar un registro
export const findInstance = async (req, res) => {

    const { id } = req.params
	const values = [id]
    
    Connection = ConnectionRestart() 

    Connection.query(SqlQuery + " WHERE ProductId = ? ", values, (err, result) => {
        
        if (result.length > 0) {
            res.json( getInstance(result[0]) )
        } else {
            res.status(404).json()
        }

    })

    Connection.end()

}

//delete un registro
export const deleteInstance = (req, res) => {

    const { id } = req.params
	const values = [id]
    
    Connection = ConnectionRestart() 

    Connection.query("DELETE FROM products WHERE ProductId = ? ", values,
    
        (err, result) => {

            res.json( !err && result.affectedRows > 0 )

        }

    )

    Connection.end()

}