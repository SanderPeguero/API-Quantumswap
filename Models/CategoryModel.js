
const CategoryModel = {
    CategoryId: 0,
    SectionId: 0,
    Description: "",
}

//obtiene una instancia de un modelo a partir de un registro de una tabla de base de datos
export function getInstanceCategory(row = null) {
    if (row == null) {
        return CategoryModel
    }

    CategoryModel.CategoryId = row.CategoryId || 0
    CategoryModel.SectionId = row.SectionId || 0
    CategoryModel.Description = row.Description || ""

    return CategoryModel
}

export default CategoryModel