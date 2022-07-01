import { ConnectionRestart } from "./Conexion/Conexion.js";

let Conexion = ConnectionRestart()

function query(values){
    
    Conexion = ConnectionRestart()

    Conexion.query("ALTER TABLE usuarios ADD SecretKey VARCHAR(56)", 
       
        (err, result) => {

            res.json({ Success: (!err && result.affectedRows > 0), MensajeError: err })

        }

    )

    Conexion.end()

}

export default query