import UserModel from "../models/UserModel.js";
import Conexion from "../Conexion/Conexion.js";

let SqlQuery = "SELECT IDUsuario, Nombre, Apellido, Email, Clave FROM usuarios"

//Instance
function getInstance(Row) {
    UserModel.IDUsuario = Row.IDUsuario
    UserModel.Nombre = Row.Nombre
    UserModel.Apellido = Row.Apellido
    UserModel.Email = Row.Email
    UserModel.Clave = Row.Clave

    return UserModel;
}

//Create
export function Create(req, res){

    UserModel.Nombre = req.body.Nombre
    UserModel.Apellido = req.body.Apellido
    UserModel.Email = req.body.Email
    UserModel.Clave = req.body.Clave
    
    if(UserModel.IDUsuario == null || UserModel.IDUsuario == 0){

        const values = [
            UserModel.Nombre,
            UserModel.Apellido,
            UserModel.Email,
            UserModel.Clave
        ]

        Conexion.connect()

        Conexion.query("INSERT INTO usuarios (Nombre, Apellido, Email, Clave) VALUES (?,?,?,?)", values,
           
            (err, result) => {

                res.json({ Success: (!err && result.affectedRows > 0), MensajeError: err })

            }
        )

        Conexion.end()

    }else{

        Update(UserModel, res)

    }

}

//Read
export function List(req,res){

    Conexion.connect()

    Conexion.query(SqlQuery, (err, result) => {
        
        if(err || result.length == 0){

            res.json({ Data: null, MensajeError: err })

        } else {

            let data = []

            for(let s = 0; s < result.length; s++){

                let row = result[s]
                data.push(Object.assign({}, getInstance(row)))

            }

            res.json({ Data: data, MensajeError: err })
        }
    })

    Conexion.end()

}

export function Search(req, res){

    const { id } = req.params
    const values = [id]

    Conexion.connect()

    Conexion.query(SqlQuery + " WHERE IDUsuario = ?", values, (err, result) => {

        if(err || result.length == 0){

            res.json({ Data: null, MensajeError: err })

        }else{

            let data = getInstance(result[0])
            res.json({ Data: data, MensajeError: err })

        }

    })

    Conexion.end()
    

}

//Update
export function Update(UserModel, res){

    const values = [
        UserModel.Nombre,
        UserModel.Apellido,
        UserModel.Email,
        UserModel.Clave,
    ]
    
    Conexion.connect()

    Conexion.query("UPDATE usuarios SET Nombre=?, Apellido=?, Email=?, Clave=? WHERE IDUsuario=?", values,
      
        (err, result) => {

            res.json({ Success: (!err && result.affectedRows > 0), MensajeError: err })
            
        }
    )

    Conexion.end()

}

//Delete
export function Delete(req, res){
    
    const UserModel = req.params
    const values = [UserModel.IDUsuario]
    
    Conexion.connect()
    
    Conexion.query("DELETE FROM usuarios WHERE IDUsuarios=?", values,
    
        (err, result) => {

            res.json({ Success: (!err && result.affectedRows > 0), MensajeError: err })

        }
    )

    Conexion.end()

}