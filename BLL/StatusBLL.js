//importamos el Modelo
import { getInstanceStatus } from "../Models/StatusModel.js"
//importamos la Connection
import { ConnectionStart } from "../DAL/Connection.js"

let Connection = ConnectionStart()
let SqlQuery = "SELECT StatusId, Description FROM statuses "

//** Métodos para el CRUD **/

//save datos
export function saveInstance (req, res) {

    const StatusModel = getInstanceStatus(req.body)

    if (StatusModel.StatusId == null || StatusModel.StatusId == 0) {
        insertInstance(StatusModel, res)
    } else {
        updateInstance(StatusModel, res)
    }

}

//Crear un registro
function insertInstance(statusModel, res) {

    var date = new Date();

    const values = [
        statusModel.Description
    ]

    const success = {
        Executed: false
    }

    Connection = ConnectionStart()

    Connection.query("INSERT INTO statuses (Description) VALUES (?)", values, (err, result) => {
        success.Executed = (!err && result.affectedRows > 0)
        Connection.destroy()
        res.json(success)
    })
    
}

//Actualizar un registro
function updateInstance(statusModel, res) {

    var date = new Date();

    const values = [
        statusModel.Description,
        statusModel.StatusId
    ]

    const success = {
        Executed: false
    }

    Connection = ConnectionStart()

    Connection.query("UPDATE statuses SET Description=? WHERE StatusId=?", values, (err, result) => {
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
            data.push(Object.assign({}, getInstanceStatus(fila)))
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

    Connection.query(SqlQuery + " WHERE StatusId = ? ", values, (err, result) => {
        Connection.destroy()
        res.json(getInstanceStatus(result[0]))
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

    Connection.query("DELETE FROM statuses WHERE StatusId = ? ", values, (err, result) => {
        success.Executed = (!err && result.affectedRows > 0)
        Connection.destroy()
        res.json(success)
    })
}