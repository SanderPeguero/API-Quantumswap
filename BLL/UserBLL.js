import UserModel from "../models/UserModel.js";
import { ConnectionRestart } from "../Connection/Connection.js";

let Conexion = ConnectionRestart()
let SqlQuery = "SELECT UserId, Name, LastName, Email, Password, SecretKey FROM users "

//Instance
function getInstance(row = null) {
    if (row == null) {
        return UserModel
    }

    UserModel.UserId = row.UserId || 0
    UserModel.Name = row.Name || ""
    UserModel.LastName = row.LastName || ""
    UserModel.Email = row.Email || ""
    UserModel.Password = row.Password || ""
    UserModel.SecretKey = row.SecretKey || ""

    return UserModel
}

//save datos
export const saveInstance = async (req, res) => {

    const UserModel = req.body

    if (UserModel.UserId == null || UserModel.UserId == 0) {
        
        insertInstance(UserModel, res)

    } else {
        
        updateInstance(UserModel, res)

    }

}

//Insert
export function insertInstance(UserModel, res){
    
    if(UserModel.UserId == null || UserModel.UserId == 0){

        const values = [
            UserModel.Name,
            UserModel.LastName,
            UserModel.Email,
            UserModel.Password
        ]

        Conexion = ConnectionRestart() 

        Conexion.query(SqlQuery + " WHERE Email = ?", UserModel.Email, (err, result) => {
            if (result.length > 0) {
                res.status(400).json( false )
            } else {
                Conexion = ConnectionRestart() 
                Conexion.query("INSERT INTO users (Name, LastName, Email, Password) VALUES (?,?,?,?)", values,
                (err, result) => {
                    res.json( !err && result.affectedRows > 0 )
                }
            )
            }
        })

        Conexion.end()

    }else{

        Update(UserModel, res)

    }

}

//Read
export function listInstances(req,res){

    Conexion = ConnectionRestart() 

    Conexion.query(SqlQuery, (err, result) => {
        
        let data = []

        for(let s = 0; s < result.length; s++){

            let row = result[s]
            data.push(Object.assign({}, getInstance(row)))

        }

        return res.json( data )
    })

    Conexion.end()

}

export function findInstance (req, res){

    const { id } = req.params
    const values = [id]

    Conexion = ConnectionRestart() 

    Conexion.query(SqlQuery + " WHERE UserId = ?", values, (err, result) => {
        
        if (result.length > 0) {
            res.json( getInstance(result[0]) )
        } else {
            res.status(404).json()
        }

    })

    Conexion.end()
}


//Login
export const findInstanceByEmail = (req, res) => {
    console.log(req.body)
    const { Email, Password } = req.body
    const values = [Email]

    Conexion = ConnectionRestart()

    Conexion.query(SqlQuery + " WHERE Email = ?", values, (err, result) => {
        
        if (result.length > 0) {

            if (result[0].Password == Password) {
                res.json( result[0] )
            } else {
                res.status(404).json( { Exist: true} )
            }
    
        } else {
            res.status(404).json( { Exist: false} )
        }
    })

    Conexion.end()
}

//Update
export function updateInstance(UserModel, res){

    const values = [
        UserModel.Name,
        UserModel.LastName,
        UserModel.Email,
        UserModel.Password,
        UserModel.SecretKey,
        UserModel.UserId
    ]
    
    Conexion = ConnectionRestart() 

    Conexion.query(SqlQuery + " WHERE Email = ?", UserModel.Email, (err, result) => {
        if (result.length > 0) {
            res.status(400).json( false )
        } else {
            Conexion = ConnectionRestart() 
            Conexion.query("UPDATE users SET Name=?, LastName=?, Email=?, Password=?, SecretKey=? WHERE UserId = ? ", values,
            (err, result) => {
                res.json( !err && result.affectedRows > 0 )
            }
        )
        }
    })

    Conexion.end()

}

//Delete
export function deleteInstance(req, res){
    
    const { id } = req.params
    const values = [id]
    
    Conexion = ConnectionRestart() 
    
    Conexion.query("DELETE FROM users WHERE UserId = ? ", values,
    
        (err, result) => {

            res.json( !err && result.affectedRows > 0 )

        }
    )

    Conexion.end()

}