
const SectionModel = {
    SectionId: 0,
    Description: "",
}

//obtiene una instancia de un modelo a partir de un registro de una tabla de base de datos
export function getInstanceSection(row = null) {
    if (row == null) {
        return SectionModel
    }

    SectionModel.SectionId = row.SectionId || 0
    SectionModel.Description = row.Description || ""

    return SectionModel
}

export default SectionModel