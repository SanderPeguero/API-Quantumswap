import { ConnectionStart } from "./DAL/Connection.js";

let Connection = ConnectionStart()

function query(res) {

    Connection = ConnectionStart()

    Connection.query("ALTER TABLE usuarios ADD SecretKey VARCHAR(56)",

        (err, result) => {

            res.json({ Success: result, MensajeError: err })

        }

    )

    Connection.end()

}

export default query