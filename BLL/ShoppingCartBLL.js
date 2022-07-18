//importamos el Modelo
import ShoppingCartModel from "../models/ShoppingCartModel.js"
import ProductModel from "../models/ProductModel.js"
//importamos la Connection
import { ConnectionRestart } from "../Connection/Connection.js"

let Connection = ConnectionRestart()
let SqlQuery = "SELECT ShoppingCartId, UserId, Amount, CreationDate, ModificationDate, Status FROM shoppingcarts "

//** Métodos para el CRUD **/

//obtiene una instancia de un modelo a partir de un registro de una tabla de base de datos
function getInstance(row = null) {
    if (row == null) {
        return ShoppingCartModel
    }

    ShoppingCartModel.ShoppingCartId = row.ShoppingCartId || 0,
        ShoppingCartModel.UserId = row.UserId || 0,
        ShoppingCartModel.Amount = row.Amount || 0,
        ShoppingCartModel.CreationDate = row.CreationDate || "",
        ShoppingCartModel.ModificationDate = row.ModificationDate || "",
        ShoppingCartModel.Status = row.Status || 0,
        ShoppingCartModel.ShoppingCartProducts = row.ShoppingCartProducts || []

    return ShoppingCartModel
}

function getInstanceProduct(row = null) {
    if (row == null) {
        return ProductModel
    }

    ProductModel.ProductId = row.ProductId || 0
    ProductModel.Stock = row.Stock || 0
    ProductModel.Price = row.Price || 0
    ProductModel.Discount = row.Discount || 0
    ProductModel.Status = row.Status || 0

    return ProductModel
}

//save datos
export const saveInstance = async (req, res) => {

    const ShoppingCartModel = req.body

    if (ShoppingCartModel.ShoppingCartId == null || ShoppingCartModel.ShoppingCartId == 0) {

        insertInstance(ShoppingCartModel, res)

    } else {

        updateInstance(ShoppingCartModel, res)

    }

}

//Crear un registro
function insertInstance(shoppingCartModel, res) {

    let SqlQueryProducts = "SELECT ProductId, Stock, Price, Discount, Status FROM products WHERE ProductId IN ("
    for (let i = 0; i < shoppingCartModel.ShoppingCartProducts.length; i++) {
        const product = shoppingCartModel.ShoppingCartProducts[i];
        SqlQueryProducts += product.ProductId

        if (i < shoppingCartModel.ShoppingCartProducts.length - 1) {
            SqlQueryProducts += ", "
        }

    }
    SqlQueryProducts += ")"

    Connection = ConnectionRestart()
    Connection.beginTransaction(function (err) {

        try {
            let products = []
            Connection.query(SqlQueryProducts, (err, result) => {

                console.log(err)
                for (let i = 0; i < result.length; i++) {
                    let fila = result[i];
                    products.push(Object.assign({}, getInstanceProduct(fila)))
                }

                if (products.length < 1) {
                    console.log("No se encontraron productos")
                    return Connection.rollback()
                } else {

                    shoppingCartModel.Amount = 0
                    for (let i = 0; i < products.length; i++) {
                        const product = products[i];
                        shoppingCartModel.Amount += product.Price * shoppingCartModel.ShoppingCartProducts[i].Quantity;
                    }

                    let values = [
                        shoppingCartModel.UserId,
                        shoppingCartModel.Amount,
                        shoppingCartModel.Status = 1
                    ]

                    Connection = ConnectionRestart()

                    let query = Connection.query("insert into shoppingcarts (UserId, Amount, CreationDate, Status) values (?, ?, NOW(), ?)", values,
                        (err, result) => {
                            if (err || result.affectedRows < 1) {
                                console.log("No se pudo insertar el carrito")
                                return Connection.rollback()
                            } else {
                                shoppingCartModel.ShoppingCartProducts.forEach(product => {

                                    values = [
                                        result.insertId,
                                        product.Quantity,
                                        product.ProductId = 1
                                    ]

                                    let query = Connection.query("insert into shoppingcartproducts (ShoppingCartId, ProductId, Quantity) values (?, ?, ?)", values,
                                        (err, result) => {
                                            if (err || result.affectedRows < 1) {
                                                console.log("No se pudo insertar el carrito con productos")
                                            } else {
                                                console.log("Carrito insertado")
                                                return Connection.rollback()
                                            }
                                        }

                                    )
                                });
                            }
                        }

                    )
                }

            })
            Connection.commit()
        } catch (error) {
            return Connection.rollback()
        }
    })
    Connection.end()


}

//Actualizar un registro
function updateInstance(shoppingCartModel, res) {

    const values = [
        shoppingCartModel.UserId,
        shoppingCartModel.Amount,
        shoppingCartModel.Status,
        shoppingCartModel.ShoppingCartId
    ]

    Connection = ConnectionRestart()

    Connection.query("UPDATE shoppingarts SET UserId=?, Amount=?, ModificationDate=NOW(), Status=? WHERE ShoppingCartId=?", values,

        (err, result) => {
            res.json(!err && result.affectedRows > 0)
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
            res.json(data)
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

    Connection.query(SqlQuery + " WHERE ShoppingCartId = ? ", values, (err, result) => {

        if (result.length > 0) {
            res.json(getInstance(result[0]))
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

    Connection.query("DELETE FROM shoppingarts WHERE ShoppingCartId = ? ", values,

        (err, result) => {

            res.json(!err && result.affectedRows > 0)

        }

    )

    Connection.end()

}