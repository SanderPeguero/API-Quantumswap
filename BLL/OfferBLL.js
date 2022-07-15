//importamos el Modelo
import { getInstanceOffer } from "../Models/OfferModel.js"
//importamos la Connection
import { ConnectionStart } from "../DAL/Connection.js"

let Connection = ConnectionStart()
let SqlQuery = "SELECT " +
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

    var date = new Date();

    const values = [
        date.toISOString().slice(0, 19).replace('T', ' '),
        1
    ]

    Connection = ConnectionStart()

    Connection.query(SqlQuery + " WHERE offers.EndingDate <= ? AND offers.Status = ? ", values, (err, result) => {

        let data = []

        if (!err) {
            for (let i = 0; i < result.length; i++) {
                let fila = result[i];
                data.push(Object.assign({}, getInstanceOffer(fila)))
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
    const values = [id, 1]

    Connection = ConnectionStart()

    Connection.query(SqlQuery + " WHERE OfferId = ? AND Status = ? ", values, (err, result) => {
        Connection.destroy()
        res.json(getInstanceOffer(result[0]))
    })

}

//delete un registro
export function deleteInstance (req, res) {

    const { id } = req.params
    const values = [2, id]

    const success = {
        Executed: false
    }

    Connection = ConnectionStart()

    Connection.query("UPDATE offers SET Status=? WHERE OfferId = ? ", values, (err, result) => {
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