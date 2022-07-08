//importamos el Modelo
import { getInstanceShoppingCart } from "../Models/ShoppingCartModel.js"
import { getInstanceProduct } from "../Models/ProductModel.js"
//importamos la Connection
import { ConnectionStart } from "../DAL/Connection.js"

let Connection = ConnectionStart()
let SqlQuery = "SELECT ShoppingCartId, UserId, Amount, CreationDate, ModificationDate, Status FROM shoppingcarts "
let SqlQueryProducts = "SELECT ProductId, Description, Stock, Cost, Price, Discount, Image, CreationDate, ModificationDate, Status FROM products "

//** Métodos para el CRUD **/

//save datos
export function saveInstance (req, res) {

    const ShoppingCartModel = getInstanceShoppingCart(req.body)

    if (ShoppingCartModel.ShoppingCartId == null || ShoppingCartModel.ShoppingCartId == 0) {
        insertInstance(ShoppingCartModel, res)
    } else {
        updateInstance(ShoppingCartModel, res)
    }

}

//Crear un registro
function insertInstance(shoppingCartModel, res) {

    let queryConcat = " WHERE ProductId IN ("
    for (let i = 0; i < shoppingCartModel.ShoppingCartProducts.length; i++) {
        const product = shoppingCartModel.ShoppingCartProducts[i];
        queryConcat += product.ProductId

        if (i < shoppingCartModel.ShoppingCartProducts.length - 1) {
            queryConcat += ", "
        }

    }
    queryConcat += ")"

    const success = {
        ProductsFounded: undefined,
        ShoppingCartInserted: undefined,
        ShoppingCartProductsInserted: undefined,
        Executed: false
    }

    Connection = ConnectionStart()
    Connection.beginTransaction(function (err) {
        try {
            let products = []
            Connection = ConnectionStart()
            Connection.query(SqlQueryProducts + queryConcat, (err, result) => {

                for (let i = 0; i < result.length; i++) {
                    let fila = result[i];
                    products.push(Object.assign({}, getInstanceProduct(fila)))
                }
                
                if (products.length < 1) {
                    success.ProductsFounded = false
                    Connection.rollback()
                    Connection.destroy()
                    res.json(success)
                } else {
                    success.ProductsFounded = true
                    
                    shoppingCartModel.Amount = 0
                    for (let i = 0; i < products.length; i++) {
                        const product = products[i];
                        shoppingCartModel.Amount += (product.Price - ((product.Discount / 100) * product.Price)) * shoppingCartModel.ShoppingCartProducts[i].Quantity;
                    }
                    
                    let values = [
                        shoppingCartModel.UserId,
                        shoppingCartModel.Amount,
                        shoppingCartModel.Status = 1
                    ]
                    
                    Connection = ConnectionStart()
                    
                    Connection.query("insert into shoppingcarts (UserId, Amount, CreationDate, Status) values (?, ?, NOW(), ?)", values, (err, result) => {
                        if (err || result.affectedRows < 1) {
                            success.ShoppingCartInserted = false
                            Connection.rollback()
                            Connection.destroy()
                            res.json(success)
                        } else {
                            success.ShoppingCartInserted = true
                            
                            for (let i = 0; i < shoppingCartModel.ShoppingCartProducts.length; i++) {
                                const product = shoppingCartModel.ShoppingCartProducts[i];
                                
                                values = [
                                    result.insertId,
                                    product.Quantity,
                                    product.ProductId = 1
                                ]
                                
                                Connection.query("insert into shoppingcartproducts (ShoppingCartId, ProductId, Quantity) values (?, ?, ?)", values, (err, result) => {
                                    if (!err && result.affectedRows > 0) {
                                        success.ShoppingCartProductsInserted = true
                                        if (i == shoppingCartModel.ShoppingCartProducts.length - 1) {
                                            success.Executed = true
                                            Connection.commit()
                                            Connection.destroy()
                                            res.json(success)
                                        }
                                    } else {
                                        success.ShoppingCartProductsInserted = false
                                        Connection.rollback()
                                        Connection.destroy()
                                        res.json(success)
                                    }
                                })
                            }
                        }
                    })
                }
            })
        } catch (error) {
            Connection.rollback()
            Connection.destroy()
            res.json(success)
        }
    })


}

//Actualizar un registro
function updateInstance(shoppingCartModel, res) {

    const values = [
        shoppingCartModel.UserId,
        shoppingCartModel.Amount,
        shoppingCartModel.Status,
        shoppingCartModel.ShoppingCartId
    ]

    Connection = ConnectionStart()

    Connection.query("UPDATE shoppingarts SET UserId=?, Amount=?, ModificationDate=NOW(), Status=? WHERE ShoppingCartId=?", values, (err, result) => {
            Connection.destroy()
            res.json(!err && result.affectedRows > 0)
        }
    )
}

//Mostrar todos los registros
export function listInstances (req, res) {

    Connection = ConnectionStart()
    Connection.query(SqlQuery, (err, result) => {
        let data = []

        for (let i = 0; i < result.length; i++) {

            let fila = result[i];
            data.push(Object.assign({}, getInstanceShoppingCart(fila)))

        }

        Conexion.end()
        res.json(data)
    })
}

//Mostrar un registro
export function findInstance (req, res) {

    const { id } = req.params
    const values = [id]

    Connection = ConnectionStart()

    Connection.query(SqlQuery + " WHERE ShoppingCartId = ? ", values, (err, result) => {
        Conexion.end()
        res.json(getInstanceShoppingCart(result[0]))
    })
}

//delete un registro
export function deleteInstance (req, res) {

    const { id } = req.params
    const values = [id]

    Connection = ConnectionStart()

    Connection.query("DELETE FROM shoppingarts WHERE ShoppingCartId = ? ", values, (err, result) => {
        success.Executed = (!err && result.affectedRows > 0)
        Conexion.end()
        res.json(success)
    })

}