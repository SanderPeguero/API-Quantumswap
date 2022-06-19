import mysql from 'mysql'

const Conexion = mysql.createConnection({
	host: 'us-cdbr-east-05.cleardb.net',
	user: 'bfdc36de5e97cf',
	password: '3554998b',
	database: 'heroku_292054ce91253dd'
})

 function ConnectionRestart(){
	
	try{

		var Conexion = mysql.createConnection({
			host: 'us-cdbr-east-05.cleardb.net',
			user: 'bfdc36de5e97cf',
			password: '3554998b',
			database: 'heroku_292054ce91253dd'
		});

	}catch(err){

		console.log("Error intentando reiniciar la conexion" + err)
		Conexion.on('error', ConnectionRestart())

	}

		
}

export default { Conexion, ConnectionRestart } 