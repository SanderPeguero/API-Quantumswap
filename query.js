import { ConnectionRestart } from "./Connection/Connection.js";

let Conexion = ConnectionRestart()

function query(res){
    
    Conexion = ConnectionRestart()

    Conexion.query("ALTER TABLE usuarios ADD SecretKey VARCHAR(56)", 
       
        (err, result) => {

            res.json({ Success: result, MensajeError: err })

        }

    )

    Conexion.end()

}

export default query