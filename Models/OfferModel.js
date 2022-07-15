
const OfferModel = {
    OfferId: 0,
    OfferTypeId: 0,
    OfferTypeDescription: "",
    EntityId: 0,
    Discount: 0,
    StartDate: "",
    EndingDate: "",
    CreationDate: "",
    ModificationDate: "",
    Status: 0
}

//obtiene una instancia de un modelo a partir de un registro de una tabla de base de datos
export function getInstanceOffer(row = null) {
    if (row == null) {
        return OfferModel
    }

    OfferModel.OfferId = row.OfferId || 0
    OfferModel.OfferTypeId = row.OfferTypeId || 0
    OfferModel.OfferTypeDescription = row.OfferTypeDescription || ""
    OfferModel.EntityId = row.EntityId || 0
    OfferModel.Discount = row.Discount || 0
    OfferModel.StartDate = row.StartDate || ""
    OfferModel.EndingDate = row.EndingDate || ""
    OfferModel.CreationDate = row.CreationDate || ""
    OfferModel.ModificationDate = row.ModificationDate || ""
    OfferModel.Status = row.Status || 0

    return OfferModel
}

export default OfferModel