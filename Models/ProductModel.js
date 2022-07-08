
const ProductModel = {
    ProductId: 0,
    Description: "",
    Stock: 0,
    Cost: 0,
    Price: 0,
    Discount: 0,
    Image: "",
    CreationDate: "",
    ModificationDate: "",
    Status: 0
}

//obtiene una instancia de un modelo a partir de un registro de una tabla de base de datos
export function getInstanceProduct(row = null) {
    if (row == null) {
        return ProductModel
    }

    ProductModel.ProductId = row.ProductId || 0
    ProductModel.Description = row.Description || ""
    ProductModel.Stock = row.Stock || 0
    ProductModel.Cost = row.Cost || 0
    ProductModel.Price = row.Price || 0
    ProductModel.Discount = row.Discount || 0
    ProductModel.Image = row.Image || ""
    ProductModel.CreationDate = row.CreationDate || ""
    ProductModel.ModificationDate = row.ModificationDate || ""
    ProductModel.Status = row.Status || 0

    return ProductModel
}

export default ProductModel