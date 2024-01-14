export interface UserFolioResponse {
    Deudors:  Deudor[];
    RowCount: number;
}

interface Deudor {
    Folio:                                      number;
    Fecha_de_Registro:                          Date;
    Hora_de_Registro:                           string;
    Usuario_que_Registra:                       number;
    Tipo_de_Persona:                            number;
    RFC:                                        string;
    CURP:                                       null;
    Nombres:                                    string;
    Apellido_Paterno:                           string;
    Apellido_Materno:                           string;
    Nombre_Completo:                            string;
    Fecha_de_Nacimiento:                        Date;
    Nacionalidad:                               null;
    Genero:                                     null;
    Estado_Civil:                               null;
    Maximo_Grado_de_Estudios:                   null;
    Nombre_Comercial:                           null;
    Razon_Social:                               null;
    Tipo_de_Regimen:                            null;
    Fecha_de_Constitucion:                      null;
    Representante_Legal:                        null;
    Folio_de_Registro:                          null;
    Notario:                                    null;
    Accionistas:                                null;
    Poderes:                                    null;
    Estatus:                                    number;
    Tipo_de_Vivienda_Actual:                    null;
    Empresa:                                    null;
    Actividad_o_Giro:                           null;
    Puesto:                                     string;
    Sueldo_Mensual:                             null;
    Antiguedad_Anos:                            null;
    Telefono_de_Oficina:                        null;
    Nombre_de_Jefe_Directo:                     null;
    Estado:                                     null;
    Ciudad:                                     null;
    Colonia:                                    null;
    Calle:                                      null;
    Numero_Exterior:                            null;
    Numero_Interior:                            null;
    Codigo_Postal:                              null;
    Usuario_que_Registra_Spartan_User:          UsuarioQueRegistraSpartanUser;
    Tipo_de_Persona_Tipo_de_Persona:            ActividadOGiroGiroDeNegocio;
    Nacionalidad_Nacionalidad:                  ActividadOGiroGiroDeNegocio;
    Genero_Genero:                              ActividadOGiroGiroDeNegocio;
    Estado_Civil_Estado_Civil:                  ActividadOGiroGiroDeNegocio;
    Maximo_Grado_de_Estudios_Grado_de_Estudios: ActividadOGiroGiroDeNegocio;
    Tipo_de_Regimen_Tipo_de_Regimen:            TipoDeRegimenTipoDeRegimen;
    Estatus_Estatus_de_Deudor:                  ActividadOGiroGiroDeNegocio;
    Tipo_de_Vivienda_Actual_Tipo_de_Vivienda:   ActividadOGiroGiroDeNegocio;
    Actividad_o_Giro_Giro_de_Negocio:           ActividadOGiroGiroDeNegocio;
    Estado_Estado:                              EstadoEstado;
    Ciudad_Ciudad:                              CiudadCiudad;
    Id:                                         number;
}

interface ActividadOGiroGiroDeNegocio {
    Clave:       number;
    Descripcion: null | string;
    Id:          number;
}

interface CiudadCiudad {
    Clave:         number;
    Nombre:        null;
    Estado:        null;
    Estado_Estado: null;
    Id:            number;
}

interface EstadoEstado {
    Clave:  number;
    Nombre: null;
    Id:     number;
}

interface TipoDeRegimenTipoDeRegimen {
    Clave:                           number;
    Descripcion:                     null;
    Tipo_de_Persona:                 null;
    Tipo_de_Persona_Tipo_de_Persona: null;
    Id:                              number;
}

export interface UsuarioQueRegistraSpartanUser {
    Id_User:                    number;
    Name:                       string;
    Role:                       null;
    Image:                      null;
    Email:                      null;
    Status:                     null;
    Username:                   null;
    Password:                   null;
    Apellido_Paterno:           null;
    Apellido_Materno:           null;
    Role_Spartan_User_Role:     null;
    Image_Spartane_File:        null;
    Status_Spartan_User_Status: null;
    Id:                         number;
}
