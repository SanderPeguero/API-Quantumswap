//importamos el Modelo
import { getInstanceProduct } from "../Models/ProductModel.js"
//importamos la Connection
import { ConnectionStart } from "../DAL/Connection.js"

let Connection = ConnectionStart()
let SqlQuery = "SELECT ProductId, Description, Stock, Cost, Price, Discount, Image, CreationDate, ModificationDate, Status FROM products "

//** Métodos para el CRUD **/

//save datos
export function saveInstance (req, res) {

    const ProductModel = getInstanceProduct(req.body)

    if (ProductModel.ProductId == null || ProductModel.ProductId == 0) {
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
        productModel.Status = 1
    ]

    const success = {
        Executed: false
    }

    Connection = ConnectionStart()

    Connection.query("INSERT INTO products (Description, Stock, Cost, Price, Discount, Image, CreationDate, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", values, (err, result) => {
        success.Executed = (!err && result.affectedRows > 0)
        Connection.destroy()
        res.json(success)
    })

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
        productModel.ModificationDate,
        productModel.Status,
        productModel.ProductId
    ]

    const success = {
        Executed: false
    }

    Connection = ConnectionStart()

    Connection.query("UPDATE products SET Description=?, Stock=?, Cost=?, Price=?, Discount=?, Image=?, ModificationDate=?, Status=? WHERE ProductId=?", values, (err, result) => {
        success.Executed = (!err && result.affectedRows > 0)
        Connection.destroy()
        res.json(success)
    })


}

//Mostrar todos los registros
export function listInstances (req, res) {

    Connection = ConnectionStart()

    Connection.query(SqlQuery, (err, result) => {

        let data = []

        for (let i = 0; i < result.length; i++) {
            let fila = result[i];
            data.push(Object.assign({}, getInstanceProduct(fila)))
        }

        Connection.destroy()
        res.json(data)
    })
}

//Mostrar un registro
export function findInstance (req, res) {

    const { id } = req.params
    const values = [id]

    Connection = ConnectionStart()

    Connection.query(SqlQuery + " WHERE ProductId = ? ", values, (err, result) => {
        Connection.destroy()
        res.json(getInstanceProduct(result[0]))
    })

}

//delete un registro
export function deleteInstance (req, res) {

    const { id } = req.params
    const values = [id]

    const success = {
        Executed: false
    }

    Connection = ConnectionStart()

    Connection.query("DELETE FROM products WHERE ProductId = ? ", values, (err, result) => {
        success.Executed = (!err && result.affectedRows > 0)
        Connection.destroy()
        res.json(success)
    })
}