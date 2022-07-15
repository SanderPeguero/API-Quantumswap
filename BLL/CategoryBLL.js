//importamos el Modelo
import { getInstanceCategory } from "../Models/CategoryModel.js"
//importamos la Connection
import { ConnectionStart } from "../DAL/Connection.js"

let Connection = ConnectionStart()
let SqlQuery = "SELECT CategoryId, SectionId, Description FROM categories "

//** Métodos para el CRUD **/

//save datos
export function saveInstance (req, res) {

    const CategoryModel = getInstanceCategory(req.body)

    if (CategoryModel.CategoryId == null || CategoryModel.CategoryId == 0) {
        insertInstance(CategoryModel, res)
    } else {
        updateInstance(CategoryModel, res)
    }

}

//Crear un registro
function insertInstance(categoryModel, res) {

    var date = new Date();

    const values = [
        categoryModel.SectionId,
        categoryModel.Description
    ]

    const success = {
        Executed: false
    }

    Connection = ConnectionStart()

    Connection.query("INSERT INTO categories (SectionId, Description) VALUES (?,?)", values, (err, result) => {
        if (!err) {
            success.Executed = true
            Connection.destroy()
            res.json(success)
        } else {
            success.Executed = true
            Connection.destroy()
            res.status(500).json(success)
        }
    })
    
}

//Actualizar un registro
function updateInstance(categoryModel, res) {

    var date = new Date();

    const values = [
        categoryModel.SectionId,
        categoryModel.Description,
        categoryModel.CategoryId
    ]

    const success = {
        Executed: false
    }

    Connection = ConnectionStart()

    Connection.query("UPDATE categories SET SectionId=?, Description=? WHERE CategoryId=?", values, (err, result) => {
        if (!err) {
            success.Executed = true
            Connection.destroy()
            res.json(success)
        } else {
            success.Executed = true
            Connection.destroy()
            res.status(500).json(success)
        }
    })


}

//Mostrar todos los registros
export function listInstances (req, res) {

    Connection = ConnectionStart()

    Connection.query(SqlQuery, (err, result) => {

        let data = []

        if (!err) {
            for (let i = 0; i < result.length; i++) {
                let fila = result[i];
                data.push(Object.assign({}, getInstanceCategory(fila)))
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
export function findInstance (req, res) {
    
    const { id } = req.params
    const values = [id]
    
    Connection = ConnectionStart()
    
    Connection.query(SqlQuery + " WHERE CategoryId = ? ", values, (err, result) => {
        Connection.destroy()
        res.json(getInstanceCategory(result[0]))
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

    Connection.query("DELETE FROM categories WHERE CategoryId = ? ", values, (err, result) => {
        if (!err) {
            success.Executed = true
            Connection.destroy()
            res.json(success)
        } else {
            success.Executed = true
            Connection.destroy()
            res.status(500).json(success)
        }
    })
}