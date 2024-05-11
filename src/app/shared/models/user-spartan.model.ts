export interface SpartanUsers {
  Spartan_Users: SpartanUser[];
  RowCount:      number;
}

export interface SpartanUser {
  Id_User:                    number;
  Name:                       string;
  Role:                       number;
  Image:                      null;
  Email:                      string;
  Status:                     number;
  Username:                   string;
  Password:                   string;
  Apellido_Paterno:           null;
  Apellido_Materno:           null;
  Producto_de_Credito:        number;
  Role_Spartan_User_Role:     RoleSpartanUserRole;
  Image_Spartane_File:        null;
  Status_Spartan_User_Status: StatusSpartanUserStatus;
  Id:                         number;
}

export interface RoleSpartanUserRole {
  User_Role_Id:                    number;
  Description:                     string;
  Status:                          null;
  Status_Spartan_User_Role_Status: null;
  Id:                              number;
}

export interface StatusSpartanUserStatus {
  User_Status_Id: number;
  Description:    string;
  Id:             number;
}
