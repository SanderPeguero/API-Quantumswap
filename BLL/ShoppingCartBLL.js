//importamos el Modelo
import { getInstanceShoppingCart } from "../Models/ShoppingCartModel.js"
import { getInstanceProduct } from "../Models/ProductModel.js"
//importamos la Connection
import { ConnectionStart } from "../DAL/Connection.js"

let Connection = ConnectionStart()
let SqlQuery = "SELECT ShoppingCartId, UserId, Amount, CreationDate, ModificationDate, Status FROM shoppingcarts "
let SqlQueryProducts = "SELECT " +
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
//** Métodos para el CRUD **/

//save datos
export function saveInstance(req, res) {

    const ShoppingCartModel = getInstanceShoppingCart(req.body)

    if (ShoppingCartModel.ShoppingCartId == null || ShoppingCartModel.ShoppingCartId == 0) {
        insertInstance(ShoppingCartModel, res)
    } else {
        updateInstance(ShoppingCartModel, res)
    }

}

//Crear un registro
function insertInstance(shoppingCartModel, res) {

    var date = new Date();

    let queryConcat = " WHERE ProductId IN ("
    for (let i = 0; i < shoppingCartModel.ShoppingCartProducts.length; i++) {
        const product = shoppingCartModel.ShoppingCartProducts[i];
        queryConcat += product.ProductId

        if (i < shoppingCartModel.ShoppingCartProducts.length - 1) {
            queryConcat += ", "
        }

    }
    queryConcat += ") "

    const success = {
        ProductsFounded: undefined,
        ShoppingCartInserted: undefined,
        ShoppingCartProductsInserted: undefined,
        Executed: false
    }

    Connection = ConnectionStart()
    Connection.beginTransaction(function (err) {
        if (!err) {
            try {
                const val = [1]
                let products = []
                Connection = ConnectionStart()
                Connection.query(SqlQueryProducts + queryConcat + " AND Status = ? ", val, (err, result) => {
                    if (!err) {
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
                                shoppingCartModel.CreationDate = date.toISOString().slice(0, 19).replace('T', ' '),
                                shoppingCartModel.Status = 1
                            ]

                            Connection = ConnectionStart()

                            Connection.query("insert into shoppingcarts (UserId, Amount, CreationDate, Status) values (?, ?, ?, ?)", values, (err, result) => {
                                if (err || result.affectedRows < 1) {
                                    success.ShoppingCartInserted = false
                                    Connection.rollback()
                                    Connection.destroy()
                                    if (err) {
                                        console.log(err)
                                        res.status(500).json(success)
                                    } else {
                                        res.json(success)
                                    }
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
                                                if (err) {
                                                    console.log(err)
                                                    res.status(500).json(success)
                                                } else {
                                                    res.json(success)
                                                }
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    } else {
                        Connection.rollback()
                        Connection.destroy()
                        console.log(err)
                        res.status(500).json(success)
                    }
                })
            } catch (error) {
                Connection.rollback()
                Connection.destroy()
                console.log(error)
                res.status(500).json(success)
            }
        } else {
            success.Executed = false
            Connection.destroy()
            console.log(err)
            res.status(500).json(success)
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

    const success = {
        Executed: false
    }

    Connection = ConnectionStart()

    Connection.query("UPDATE shoppingarts SET UserId=?, Amount=?, ModificationDate=NOW(), Status=? WHERE ShoppingCartId=?", values, (err, result) => {
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

    const values = [
        1
    ]

    Connection = ConnectionStart()
    Connection.query(SqlQuery + " WHERE Status = ? ", values, (err, result) => {
        let data = []

        if (!err) {
            for (let i = 0; i < result.length; i++) {
                let fila = result[i];
                data.push(Object.assign({}, getInstanceShoppingCart(fila)))
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

    Connection.query(SqlQuery + " WHERE ShoppingCartId = ? AND Status = ? ", values, (err, result) => {
        Connection.end()
        res.json(getInstanceShoppingCart(result[0]))
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

    Connection.query("UPDATE shoppingcarts SET Status=? WHERE ShoppingCartId = ? ", values, (err, result) => {
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