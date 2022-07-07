
const UserModel = {
    UserId: 0,
    Name: "",
    LastName: "",
    Email: "",
    Password: "",
    SecretKey: ""
}

export function getUserInstance(row = null) {
    if (row == null) {
        return UserModel
    }

    UserModel.UserId = row.UserId || 0
    UserModel.Name = row.Name || ""
    UserModel.LastName = row.LastName || ""
    UserModel.Email = row.Email || ""
    UserModel.Password = row.Password || ""
    UserModel.SecretKey = row.SecretKey || ""

    return UserModel
}

export default UserModel