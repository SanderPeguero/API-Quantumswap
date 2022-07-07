import { ConnectionStart } from "./DAL/Connection.js";

let Conexion = ConnectionStart()

function query(res) {

    Conexion = ConnectionStart()

    Conexion.query("ALTER TABLE usuarios ADD SecretKey VARCHAR(56)",

        (err, result) => {

            res.json({ Success: result, MensajeError: err })

        }

    )

    Conexion.end()

}

export default query