
const OfferTypeModel = {
    OfferTypeId: 0,
    Description: "",
}

//obtiene una instancia de un modelo a partir de un registro de una tabla de base de datos
export function getInstanceOfferType(row = null) {
    if (row == null) {
        return OfferTypeModel
    }

    OfferTypeModel.OfferTypeId = row.OfferTypeId || 0
    OfferTypeModel.Description = row.Description || ""

    return OfferTypeModel
}

export default OfferTypeModel