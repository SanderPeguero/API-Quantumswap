import mysql from 'mysql'

const Connection = mysql.createConnection({
	host: 'us-cdbr-east-05.cleardb.net',
	user: 'bfdc36de5e97cf',
	password: '3554998b',
	database: 'heroku_292054ce91253dd'
})

function ConnectionRestart(){
	
	try{

		var Connection = mysql.createConnection({
			host: 'us-cdbr-east-05.cleardb.net',
			user: 'bfdc36de5e97cf',
			password: '3554998b',
			database: 'heroku_292054ce91253dd'
		});
		
		return Connection
		
	}catch(err){

		console.log("Error intentando reiniciar la Connection" + err)
		Connection.on('error', ConnectionRestart())

	}

		
}

export { Connection, ConnectionRestart } 