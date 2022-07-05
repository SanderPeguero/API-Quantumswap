import UserModel from "../models/UserModel.js";
import { ConnectionRestart } from "../Conexion/Conexion.js";

let Conexion = ConnectionRestart()
let SqlQuery = "SELECT UserId, Name, LastName, Email, Password, SecretKey FROM users"

//Instance
function getInstance(Row) {
    if (Row == null) {
        return UserModel
    }

    UserModel.UserId = Row.UserId
    UserModel.Name = Row.Name
    UserModel.LastName = Row.LastName
    UserModel.Email = Row.Email
    UserModel.Password = Row.Password
    UserModel.SecretKey = Row.SecretKey

    return UserModel
}

export function Login(req, res){

    const { Email, Password } = req.body
    const values = [Email, Password]

    Conexion = ConnectionRestart()

    Conexion.query(SqlQuery + " WHERE Email = ? AND Password = ?", values, (err, result) => {
        res.json(getInstance(result.length > 0 ? result[0] : null))
    })

    Conexion.end()
}

//Create
export function Create(req, res){

    UserModel.UserId = 0
    UserModel.Name = req.body.Name
    UserModel.LastName = req.body.LastName
    UserModel.Email = req.body.Email
    UserModel.Password = req.body.Password
    
    if(UserModel.UserId == null || UserModel.UserId == 0){

        const values = [
            UserModel.Name,
            UserModel.LastName,
            UserModel.Email,
            UserModel.Password
        ]

        Conexion = ConnectionRestart() 

        Conexion.query("INSERT INTO users (Name, LastName, Email, Password) VALUES (?,?,?,?)", values,
           
            (err, result) => {

                res.json( !err && result.affectedRows > 0 )

            }
        )

        Conexion.end()

    }else{

        Update(UserModel, res)

    }

}

//Read
export function List(req,res){

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

export function Search(req, res){

    const { id } = req.params
    const values = [id]

    Conexion = ConnectionRestart() 

    Conexion.query(SqlQuery + " WHERE UserId = ?", values, (err, result) => {
        let data = getInstance(result.length > 0 ? result[0] : null)
        res.json( data )
    })

    Conexion.end()
}

//Update
export function Update(UserModel, res){

    const values = [
        UserModel.Name,
        UserModel.LastName,
        UserModel.Email,
        UserModel.Password,
        UserModel.SecretKey
    ]
    
    Conexion = ConnectionRestart() 

    Conexion.query("UPDATE users SET Name=?, LastName=?, Email=?, Password=?, SecretKey=? WHERE UserId = ? ", values,
      
        (err, result) => {

            res.json( !err && result.affectedRows > 0 )
            
        }
    )

    Conexion.end()

}

//Delete
export function Delete(req, res){
    
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