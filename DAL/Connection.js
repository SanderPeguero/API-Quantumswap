import mysql from 'mysql'

let ConnectionData = {
	/*host: 'localhost',
	user: 'root',
	password: '',
	database: 'quantumswapp'*/
	host: 'us-cdbr-east-05.cleardb.net',
	user: 'bfdc36de5e97cf',
	password: '3554998b',
	database: 'heroku_292054ce91253dd'
}

let Connection = mysql.createConnection({
	host: ConnectionData.host,
	user: ConnectionData.user,
	password: ConnectionData.password,
	database: ConnectionData.database
})

function ConnectionStart() {

	try {
		Connection.destroy()
		Connection = mysql.createConnection({
			host: ConnectionData.host,
			user: ConnectionData.user,
			password: ConnectionData.password,
			database: ConnectionData.database
		})

		return Connection

	} catch (err) {

		console.log("Restarting Connection..." + err)
		Connection.on('error', ConnectionStart())

	}


}

export { Connection, ConnectionStart } 