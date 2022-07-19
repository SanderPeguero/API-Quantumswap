//importamos el Modelo
import { getInstanceSection } from "../Models/SectionModel.js"
//importamos la Connection
import { ConnectionStart } from "../DAL/Connection.js"

let Connection = ConnectionStart()
let SqlQuery = "SELECT SectionId, Description FROM sections "

//** Métodos para el CRUD **/

//save datos
export function saveInstance(req, res) {

    const SectionModel = getInstanceSection(req.body)

    if (SectionModel.SectionId == null || SectionModel.SectionId == 0) {
        insertInstance(SectionModel, res)
    } else {
        updateInstance(SectionModel, res)
    }

}

//Crear un registro
function insertInstance(sectionModel, res) {

    var date = new Date();

    const values = [
        sectionModel.Description
    ]

    const success = {
        Executed: false
    }

    Connection = ConnectionStart()

    Connection.query("INSERT INTO sections (Description) VALUES (?)", values, (err, result) => {
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
function updateInstance(sectionModel, res) {

    var date = new Date();

    const values = [
        sectionModel.Description,
        sectionModel.SectionId
    ]

    const success = {
        Executed: false
    }

    Connection = ConnectionStart()

    Connection.query("UPDATE sections SET Description=? WHERE SectionId=?", values, (err, result) => {
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

    Connection = ConnectionStart()

    Connection.query(SqlQuery, (err, result) => {

        let data = []

        if (!err) {
            for (let i = 0; i < result.length; i++) {
                let fila = result[i];
                data.push(Object.assign({}, getInstanceSection(fila)))
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
    const values = [id]

    Connection = ConnectionStart()

    Connection.query(SqlQuery + " WHERE SectionId = ? ", values, (err, result) => {
        Connection.destroy()
        res.json(getInstanceSection(result[0]))
    })

}

//delete un registro
export function deleteInstance(req, res) {

    const { id } = req.params
    const values = [id]

    const success = {
        Executed: false
    }

    Connection = ConnectionStart()

    Connection.query("DELETE FROM sections WHERE SectionId = ? ", values, (err, result) => {
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