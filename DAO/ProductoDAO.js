//importamos el Modelo
import ProductModel from "../models/ProductModel.js"
import ImagenModel from "../models/ImagenModel.js"
//importamos la Conexion
import { ConnectionRestart } from "../Conexion/Conexion.js"

let Conexion = ConnectionRestart()
let SqlQuery = "SELECT ProductId, Description, Stock, Cost, Price, Discount, Image, CreationDate, ModificationDate, Status FROM products "
let SqlQueryImagen = "SELECT `IDImagen`, `ProductId`, `Nombre`, `CreationDate` FROM `imagenes` "

//** Métodos para el CRUD **/

//obtiene una instancia de un modelo a partir de un registro de una tabla de base de datos
function getInstancia(fila) {
    if (fila == null) {
        return ProductModel
    }

    ProductModel.ProductId = fila.ProductId
    ProductModel.Description = fila.Description
    ProductModel.Stock = fila.Stock
    ProductModel.Cost = fila.Cost
    ProductModel.Price = fila.Price
    ProductModel.Discount = fila.Discount
    ProductModel.Image = fila.Image
    ProductModel.CreationDate = fila.CreationDate
    ProductModel.ModificationDate = fila.ModificationDate
    ProductModel.Status = fila.Status
    if (ProductModel.ProductId > 0) {
        //ProductModel.Images = listarImagenes(ProductModel.ProductId)
    }
    return ProductModel
}

//guardar datos
export const guardar = async (req, res) => {

    const ProductModel = req.body

    if (ProductModel.ProductId == 0) {
        
        insertar(ProductModel, res)

    } else {
        
        modificar(ProductModel, res)

    }

}

//Crear un registro
function insertar(productModel, res) {
	
    const values = [
        productModel.Description,
        productModel.Stock,
        productModel.Cost,
        productModel.Price,
        productModel.Discount,
        productModel.Image,
        productModel.CreationDate,
        productModel.ModificationDate,
        productModel.Status
    ]
    
    Conexion = ConnectionRestart() 

    Conexion.query("INSERT INTO productos (Description, Stock, Cost, Price, Discount, Image, CreationDate, ModificationDate, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", values,
        
        (err, result) => {
            res.json( !err && result.affectedRows > 0 )
        }

    )

    Conexion.end()
}

//Actualizar un registro
function modificar(productModel, res) {

	const values = [
        productModel.Description,
        productModel.Stock,
        productModel.Cost,
        productModel.Price,
        productModel.Discount,
        productModel.Image,
        productModel.CreationDate,
        productModel.ModificationDate,
        productModel.Status,
        productModel.ProductId
    ]
    
    Conexion = ConnectionRestart() 

    Conexion.query("UPDATE productos SET Description=?, Stock=?, Cost=?, Price=?, Discount=?, Image=?, CreationDate=?, ModificationDate=?, Status=? WHERE ProductId=?", values,
    
        (err, result) => {
            res.json( !err && result.affectedRows > 0 )
        }

    )

    Conexion.end()

}

//Mostrar todos los registros
export const listar = (req, res) => {
    
    Conexion = ConnectionRestart() 

    Conexion.query(SqlQuery, (err, result) => {
        let data = []
        
        for (let i = 0; i < result.length; i++) {
        
            let fila = result[i];
            data.push(Object.assign({}, getInstancia(fila)))
        
        }
        
        return res.json( data )
    })

    // Conexion.destroy()
    Conexion.end()

}

//Mostrar un registro
export const buscar = async (req, res) => {

    const { id } = req.params
	const values = [id]
    
    Conexion = ConnectionRestart() 

    Conexion.query(SqlQuery + " WHERE ProductId = ? ", values, (err, result) => {
        let data = getInstancia(result[0])
        res.json( data )
    })

    Conexion.end()

}

//Eliminar un registro
export const eliminar = (req, res) => {

    const { id } = req.params
	const values = [id]
    
    Conexion = ConnectionRestart() 

    Conexion.query("DELETE FROM productos WHERE ProductId = ? ", values,
    
        (err, result) => {

            res.json( !err && result.affectedRows > 0 )

        }

    )

    Conexion.end()

}



//obtiene una instancia de un modelo a partir de un registro de una tabla de base de datos
function getInstanciaImagen(resultSet) {
    ImagenModel.IDImagen = resultSet.IDImagen
    ImagenModel.ProductId = resultSet.ProductId
    ImagenModel.Nombre = resultSet.Nombre
    ImagenModel.CreationDate = resultSet.CreationDate
    return ImagenModel
}

//guardar datos
export const guardarImagen = async (req, res) => {
    const ImagenModel = req.body
    if (ImagenModel.IDImagen == 0) {
        insertarImagen(ImagenModel, res)
    } else {
        modificarImagen(ImagenModel, res)
    }
}

//Crear un registro
async function insertarImagen(imagenModel, res) {
	const values = [
        imagenModel.ProductId,
        imagenModel.Nombre,
        imagenModel.CreationDate
    ]
    await Conexion.query("INSERT INTO imagenes (ProductId, Nombre, CreationDate) VALUES (?, ?, ?)", values,
        (err, result) => {
            res.json( !err && result.affectedRows > 0 )
        }
    )
}

//Actualizar un registro
async function modificarImagen(imagenModel, res) {
	const values = [
        imagenModel.Nombre,
        imagenModel.IDImagen,
    ]
    await Conexion.query("UPDATE imagenes SET Nombre = ? WHERE IDImagen = ?", values,
        (err, result) => {
            res.json( !err && result.affectedRows > 0 )
        }
    )
}

//Mostrar todos los registros
async function listarImagenes(id) {
    let data = []
	const values = [id]
    await Conexion.query(SqlQueryImagen + " WHERE ProductId = " + id,
     id, (err, result) => {
        if (!err && result.length > 0) {
            result.forEach(fila => {
                data.push(fila)
            })
        }
    })
    return data
}

//Mostrar un registro
export const buscarImagen = async (req, res) => {
    const { id } = req.params
	const values = [id]
    await Conexion.query(SqlQueryImagen + " WHERE IDImagen = ? ", values, (err, result) => {
        let data = getInstanciaImagen(result[0])
        res.json( data )
    })
}

//Eliminar un registro
export const eliminarImagen = async (req, res) => {
    const ImagenModel = req.params
	const values = [ImagenModel.IDImagen]
    await Conexion.query("DELETE FROM imagens WHERE IDImagen=? ", values,
        (err, result) => {
            res.json( !err && result.affectedRows > 0 )
        }
    )
}