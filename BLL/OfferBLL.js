//importamos el Modelo
import { getInstanceOffer } from "../Models/OfferModel.js"
//importamos la Connection
import { ConnectionStart } from "../DAL/Connection.js"

let Connection = ConnectionStart()
let SqlQuery = "SELECT OfferId, OfferTypeId, EntityId, Discount, StartDate, EndingDate, CreationDate, ModificationDate, Status FROM offers "

//** Métodos para el CRUD **/

//save datos
export function saveInstance (req, res) {

    const OfferModel = getInstanceOffer(req.body)

    if (OfferModel.OfferId == null || OfferModel.OfferId == 0) {
        insertInstance(OfferModel, res)
    } else {
        updateInstance(OfferModel, res)
    }

}

//Crear un registro
function insertInstance(offerModel, res) {

    var date = new Date();

    const values = [
        offerModel.OfferTypeId,
        offerModel.EntityId,
        offerModel.Discount,
        offerModel.StartDate,
        offerModel.EndingDate,
        offerModel.CreationDate = date.toISOString().slice(0, 19).replace('T', ' '),
        offerModel.Status = 1
    ]

    const success = {
        Executed: false
    }

    Connection = ConnectionStart()

    Connection.query("INSERT INTO offers (OfferTypeId, EntityId, Discount, StartDate, EndingDate, CreationDate, Status) VALUES (?, ?, ?, ?, ?, ?, ?)", values, (err, result) => {
        success.Executed = (!err && result.affectedRows > 0)
        Connection.destroy()
        res.json(success)
    })
    
}

//Actualizar un registro
function updateInstance(offerModel, res) {

    var date = new Date();

    const values = [
        offerModel.OfferTypeId,
        offerModel.EntityId,
        offerModel.Discount,
        offerModel.StartDate,
        offerModel.EndingDate,
        offerModel.ModificationDate = date.toISOString().slice(0, 19).replace('T', ' '),
        offerModel.Status,
        offerModel.OfferId
    ]

    const success = {
        Executed: false
    }

    Connection = ConnectionStart()

    Connection.query("UPDATE offers SET OfferTypeId=?, EntityId=?, Discount=?, StartDate=?, EndingDate=?, ModificationDate=?, Status=? WHERE OfferId=?", values, (err, result) => {
        success.Executed = (!err && result.affectedRows > 0)
        Connection.destroy()
        res.json(success)
    })


}

//Mostrar todos los registros
export function listInstances (req, res) {

    var date = new Date();

    const values = [
        date.toISOString().slice(0, 19).replace('T', ' ')
    ]

    Connection = ConnectionStart()

    Connection.query(SqlQuery + " WHERE EndingDate <= ?", values, (err, result) => {

        let data = []

        for (let i = 0; i < result.length; i++) {
            let fila = result[i];
            data.push(Object.assign({}, getInstanceOffer(fila)))
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

    Connection.query(SqlQuery + " WHERE OfferId = ? ", values, (err, result) => {
        Connection.destroy()
        res.json(getInstanceOffer(result[0]))
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

    Connection.query("DELETE FROM offers WHERE OfferId = ? ", values, (err, result) => {
        success.Executed = (!err && result.affectedRows > 0)
        Connection.destroy()
        res.json(success)
    })
}