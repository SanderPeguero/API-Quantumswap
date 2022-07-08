import { getUserInstance } from "../models/UserModel.js";
import { ConnectionStart } from "../DAL/Connection.js";

let Connection = ConnectionStart()
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

    Connection = ConnectionStart()

    Connection.query(SqlQuery + " WHERE Email = ?", UserModel.Email, (err, result) => {
        if (result.length < 1) {
            Connection = ConnectionStart()
            Connection.query("INSERT INTO users (Name, LastName, Email, Password) VALUES (?,?,?,?)", values, (err, result) => {
                success.ValidEmail = true
                success.Executed = (!err && result.affectedRows > 0)
                Connection.destroy()
                res.json(success)
            })
        } else {
            success.ValidEmail = false
            Connection.destroy()
            res.json(success)
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

    Connection = ConnectionStart()

    Connection.query(SqlQuery + " WHERE UserId = ?", UserModel.UserId, (err, result) => {
        if (result.length > 0) {
            if (result[0].Email == UserModel.Email) {
                Connection = ConnectionStart()
                Connection.query("UPDATE users SET Name=?, LastName=?, Email=?, Password=?, SecretKey=? WHERE UserId = ? ", values, (err, result) => {
                    success.ValidEmail = true
                    success.Executed = (!err && result.affectedRows > 0)
                    Connection.destroy()
                    res.json(success)
                })
            } else {
                Connection = ConnectionStart()
                Connection.query(SqlQuery + " WHERE Email = ?", UserModel.Email, (err, result) => {
                    if (result.length > 0) {
                        success.ValidEmail = false
                    }
                    Connection.destroy()
                    res.json(success)
                })
            }
        }
    })
}

//Read
export function listInstances(req, res) {

    Connection = ConnectionStart()

    Connection.query(SqlQuery, (err, result) => {

        let data = []

        for (let s = 0; s < result.length; s++) {
            let row = result[s]
            data.push(Object.assign({}, getUserInstance(row)))
        }

        Connection.destroy()
        res.json(data)
    })


}

export function findInstance(req, res) {

    const { id } = req.params
    const values = [id]

    Connection = ConnectionStart()

    Connection.query(SqlQuery + " WHERE UserId = ?", values, (err, result) => {
        Connection.destroy()
        res.json(getUserInstance(result[0]))
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

    Connection = ConnectionStart()

    Connection.query(SqlQuery + " WHERE Email = ?", values, (err, result) => {

        if (result.length > 0) {
            success.Exist = true
            if (result[0].Password == Password) {
                success.User = getUserInstance(result[0])
            }
        } else {
            success.Exist = false
        }
        Connection.destroy()
        res.json(success)
    })

}

//Delete
export function deleteInstance(req, res) {

    const { id } = req.params
    const values = [id]

    const success = {
        Executed: false
    }

    Connection = ConnectionStart()

    Connection.query("DELETE FROM users WHERE UserId = ? ", values, (err, result) => {
        success.Executed = (!err && result.affectedRows > 0)
        Connection.destroy()
        res.json(success)
    })
}