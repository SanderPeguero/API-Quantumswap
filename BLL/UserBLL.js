import { getUserInstance } from "../models/UserModel.js";
import { ConnectionStart } from "../DAL/Connection.js";

let Conexion = ConnectionStart()
let SqlQuery = "SELECT UserId, Name, LastName, Email, Password, SecretKey FROM users "

//save datos
export function saveInstance (req, res) {

    const UserModel = getUserInstance(req.body)

    if (UserModel.UserId == null || UserModel.UserId == 0) {
        insertInstance(UserModel, res)
    } else {
        updateInstance(UserModel, res)
    }

}

//Insert
export function insertInstance(UserModel, res) {

    const values = [
        UserModel.Name,
        UserModel.LastName,
        UserModel.Email,
        UserModel.Password
    ]

    const success = {
        ValidEmail: undefined,
        Executed: false
    }

    Conexion = ConnectionStart()

    Conexion.query(SqlQuery + " WHERE Email = ?", UserModel.Email, (err, result) => {
        if (result.length < 1) {
            Conexion = ConnectionStart()
            Conexion.query("INSERT INTO users (Name, LastName, Email, Password) VALUES (?,?,?,?)", values, (err, result) => {
                success.ValidEmail = true
                success.Executed = (!err && result.affectedRows > 0)
                res.json(success)
                Conexion.end()
            })
        } else {
            success.ValidEmail = false
            res.json(success)
            Conexion.end()
        }
    })
}

//Update
export function updateInstance(UserModel, res) {

    const values = [
        UserModel.Name,
        UserModel.LastName,
        UserModel.Email,
        UserModel.Password,
        UserModel.SecretKey,
        UserModel.UserId
    ]

    const success = {
        ValidEmail: undefined,
        Executed: false
    }

    Conexion = ConnectionStart()

    Conexion.query(SqlQuery + " WHERE UserId = ?", UserModel.UserId, (err, result) => {
        if (result.length > 0) {
            if (result[0].Email == UserModel.Email) {
                Conexion = ConnectionStart()
                Conexion.query("UPDATE users SET Name=?, LastName=?, Email=?, Password=?, SecretKey=? WHERE UserId = ? ", values, (err, result) => {
                    success.ValidEmail = true
                    success.Executed = (!err && result.affectedRows > 0)
                })
            } else {
                Conexion = ConnectionStart()
                Conexion.query(SqlQuery + " WHERE Email = ?", UserModel.Email, (err, result) => {
                    if (result.length > 0) {
                        success.ValidEmail = false
                    }
                })
            }
        }
        res.json(success)
        Conexion.end()
    })
}

//Read
export function listInstances(req, res) {

    Conexion = ConnectionStart()

    Conexion.query(SqlQuery, (err, result) => {

        let data = []

        for (let s = 0; s < result.length; s++) {
            let row = result[s]
            data.push(Object.assign({}, getUserInstance(row)))
        }

        res.json(data)
        Conexion.end()
    })


}

export function findInstance(req, res) {

    const { id } = req.params
    const values = [id]

    Conexion = ConnectionStart()

    Conexion.query(SqlQuery + " WHERE UserId = ?", values, (err, result) => {
        res.json(getUserInstance(result[0]))
        Conexion.end()
    })

}


//Login
export function findInstanceByEmail (req, res) {

    const { Email, Password } = req.body
    const values = [Email]

    const success = {
        User: undefined,
        Exist: undefined
    }

    Conexion = ConnectionStart()

    Conexion.query(SqlQuery + " WHERE Email = ?", values, (err, result) => {

        if (result.length > 0) {
            success.Exist = true
            if (result[0].Password == Password) {
                success.User = getUserInstance(result[0])
            }
        } else {
            success.Exist = false
        }
        res.json(success)
        Conexion.end()
    })

}

//Delete
export function deleteInstance(req, res) {

    const { id } = req.params
    const values = [id]

    const success = {
        Executed: false
    }

    Conexion = ConnectionStart()

    Conexion.query("DELETE FROM users WHERE UserId = ? ", values, (err, result) => {
        success.Executed = (!err && result.affectedRows > 0)
        res.json(success)
        Conexion.end()
    })
}