
const ShoppingCartModel = {
    ShoppingCartId: 0,
    UserId: 0,
    Amount: 0,
    CreationDate: "",
    ModificationDate: "",
    Status: 0,
    ShoppingCartProducts: []
}

//obtiene una instancia de un modelo a partir de un registro de una tabla de base de datos
export function getInstanceShoppingCart(row = null) {
    if (row == null) {
        return ShoppingCartModel
    }

    ShoppingCartModel.ShoppingCartId = row.ShoppingCartId || 0,
        ShoppingCartModel.UserId = row.UserId || 0,
        ShoppingCartModel.Amount = row.Amount || 0,
        ShoppingCartModel.CreationDate = row.CreationDate || "",
        ShoppingCartModel.ModificationDate = row.ModificationDate || "",
        ShoppingCartModel.Status = row.Status || 0,
        ShoppingCartModel.ShoppingCartProducts = row.ShoppingCartProducts || []

    return ShoppingCartModel
}

export default ShoppingCartModel