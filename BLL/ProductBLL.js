//importamos el Modelo
import { getInstanceProduct } from "../Models/ProductModel.js"
//importamos la Connection
import { ConnectionStart } from "../DAL/Connection.js"

let Connection = ConnectionStart()
let SqlQuery = "SELECT " +
    "products.ProductId, " +
    "products.CategoryId, " +
    "sections.`SectionId`, " +
    "categories.`Description` AS CategoryDescription, " +
    "sections.`Description` AS SectionDescription, " +
    "products.Description, " +
    "products.Stock, " +
    "products.Cost, " +
    "products.Price, " +
    "products.Discount, " +
    "products.Image, " +
    "products.CreationDate, " +
    "products.ModificationDate, " +
    "products.Status " +
    "FROM products " +
    "LEFT JOIN categories ON categories.`CategoryId` = products.`CategoryId` " +
    "LEFT JOIN sections ON categories.`CategoryID` = products.`CategoryID` "
let SqlQueryOffer = "SELECT " +
    "offers.OfferId, " +
    "offers.OfferTypeId, " +
    "offertypes.`Description` AS OfferTypeDescription, " +
    "offers.EntityId, " +
    "offers.Discount, " +
    "offers.StartDate, " +
    "offers.EndingDate, " +
    "offers.CreationDate, " +
    "offers.ModificationDate, " +
    "offers.Status " +
    "FROM offers " +
    "LEFT JOIN offertypes ON offertypes.`OfferTypeId` = offers.`OfferTypeId`"

//** Métodos para el CRUD **/

//save datos
export function saveInstance(req, res) {

    const ProductModel = getInstanceProduct(req.body)

    if (ProductModel.ProductId == null || ProductModel.ProductId == 0) {
        insertInstance(ProductModel, res)
    } else {
        updateInstance(ProductModel, res)
    }

}

//Crear un registro
function insertInstance(productModel, res) {

    var date = new Date();

    const values = [
        productModel.CategoryId,
        productModel.Description,
        productModel.Stock,
        productModel.Cost,
        productModel.Price,
        productModel.Discount,
        productModel.Image,
        productModel.CreationDate = date.toISOString().slice(0, 19).replace('T', ' '),
        productModel.Status = 1
    ]

    const success = {
        Executed: false
    }

    Connection = ConnectionStart()

    Connection.query("INSERT INTO products (CategoryId, Description, Stock, Cost, Price, Discount, Image, CreationDate, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", values, (err, result) => {
        if (!err) {
            success.Executed = true
            Connection.destroy()
            res.json(success)
        } else {
            success.Executed = false
            Connection.destroy()
            console.log(err)
            res.status(500).json(success)
        }
    })

}

//Actualizar un registro
function updateInstance(productModel, res) {

    var date = new Date();

    const values = [
        productModel.CategoryId,
        productModel.Description,
        productModel.Stock,
        productModel.Cost,
        productModel.Price,
        productModel.Discount,
        productModel.Image,
        productModel.ModificationDate = date.toISOString().slice(0, 19).replace('T', ' '),
        productModel.Status,
        productModel.ProductId
    ]

    const success = {
        Executed: false
    }

    Connection = ConnectionStart()

    Connection.query("UPDATE products SET CategoryId=?, Description=?, Stock=?, Cost=?, Price=?, Discount=?, Image=?, ModificationDate=?, Status=? WHERE ProductId=?", values, (err, result) => {
        if (!err) {
            success.Executed = true
            Connection.destroy()
            res.json(success)
        } else {
            success.Executed = false
            Connection.destroy()
            console.log(err)
            res.status(500).json(success)
        }
    })


}

//Mostrar todos los registros
export function listInstances(req, res) {

    const values = [1]

    Connection = ConnectionStart()

    Connection.query(SqlQuery + " WHERE products.Status = ? ", values, (err, result) => {

        let data = []

        if (!err) {
            for (let i = 0; i < result.length; i++) {
                let fila = result[i];
                data.push(Object.assign({}, getInstanceProduct(fila)))
            }
            Connection.destroy()
            res.json(data)
        } else {
            Connection.destroy()
            console.log(err)
            res.status(500).json(data)
        }

    })
}

//Mostrar todos los registros por categoria
export function listInstancesByCategory(req, res) {

    const {id} = req.params
    const values = [1, id]

    Connection = ConnectionStart()

    Connection.query(SqlQuery + " WHERE products.Status = ? AND products.CategoryId = ? ", values, (err, result) => {

        let data = []

        if (!err) {
            for (let i = 0; i < result.length; i++) {
                let fila = result[i];
                data.push(Object.assign({}, getInstanceProduct(fila)))
            }
            Connection.destroy()
            res.json(data)
        } else {
            Connection.destroy()
            console.log(err)
            res.status(500).json(data)
        }

    })
}

//Mostrar un registro
export function findInstance(req, res) {

    const { id } = req.params
    const values = [id, 1]

    Connection = ConnectionStart()

    Connection.query(SqlQuery + " WHERE ProductId = ? AND Status = ? ", values, (err, result) => {
        Connection.destroy()
        res.json(getInstanceProduct(result[0]))
    })

}

//delete un registro
export function deleteInstance(req, res) {

    const { id } = req.params
    const values = [2, id]

    const success = {
        Executed: false
    }

    Connection = ConnectionStart()

    Connection.query("UPDATE products SET Status=? WHERE ProductId = ? ", values, (err, result) => {
        if (!err) {
            success.Executed = true
            Connection.destroy()
            res.json(success)
        } else {
            success.Executed = false
            Connection.destroy()
            console.log(err)
            res.status(500).json(success)
        }
    })
}