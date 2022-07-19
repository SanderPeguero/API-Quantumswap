//importamos el Modelo
import { getInstanceOfferType } from "../Models/OfferTypeModel.js"
//importamos la Connection
import { ConnectionStart } from "../DAL/Connection.js"

let Connection = ConnectionStart()
let SqlQuery = "SELECT OfferTypeId, Description FROM offertypes "

//** Métodos para el CRUD **/

//save datos
export function saveInstance(req, res) {

    const OfferTypeModel = getInstanceOfferType(req.body)

    if (OfferTypeModel.OfferTypeId == null || OfferTypeModel.OfferTypeId == 0) {
        insertInstance(OfferTypeModel, res)
    } else {
        updateInstance(OfferTypeModel, res)
    }

}

//Crear un registro
function insertInstance(offerTypeModel, res) {

    var date = new Date();

    const values = [
        offerTypeModel.Description
    ]

    const success = {
        Executed: false
    }

    Connection = ConnectionStart()

    Connection.query("INSERT INTO offertypes (Description) VALUES (?)", values, (err, result) => {
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
function updateInstance(offerTypeModel, res) {

    var date = new Date();

    const values = [
        offerTypeModel.Description,
        offerTypeModel.OfferTypeId
    ]

    const success = {
        Executed: false
    }

    Connection = ConnectionStart()

    Connection.query("UPDATE offertypes SET Description=? WHERE OfferTypeId=?", values, (err, result) => {
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
                data.push(Object.assign({}, getInstanceOfferType(fila)))
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

    Connection.query(SqlQuery + " WHERE OfferTypeId = ? ", values, (err, result) => {
        Connection.destroy()
        res.json(getInstanceOfferType(result[0]))
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

    Connection.query("DELETE FROM offertypes WHERE OfferTypeId = ? ", values, (err, result) => {
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