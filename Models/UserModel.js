
const UserModel = {
    UserId: 0,
    Name: "",
    LastName: "",
    Email: "",
    Password: "",
    SecretKey: "",
    CreationDate: "",
    ModificationDate: "",
    Status: 0
}

export function getInstanceUser(row = null) {
    if (row == null) {
        return UserModel
    }

    UserModel.UserId = row.UserId || 0
    UserModel.Name = row.Name || ""
    UserModel.LastName = row.LastName || ""
    UserModel.Email = row.Email || ""
    UserModel.Password = row.Password || ""
    UserModel.SecretKey = row.SecretKey || ""
    UserModel.CreationDate = row.CreationDate || ""
    UserModel.ModificationDate = row.ModificationDate || ""
    UserModel.Status = row.Status || 0

    return UserModel
}

export default UserModel