
const StatusModel = {
    StatusId: 0,
    Description: "",
}

//obtiene una instancia de un modelo a partir de un registro de una tabla de base de datos
export function getInstanceStatus(row = null) {
    if (row == null) {
        return StatusModel
    }

    StatusModel.StatusId = row.StatusId || 0
    StatusModel.Description = row.Description || ""

    return StatusModel
}

export default StatusModel