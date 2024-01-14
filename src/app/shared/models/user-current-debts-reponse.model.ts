export interface UserCurrentDebtsResponse {
    Creditos: Credito[];
    RowCount: number;
}

export interface Credito {
    Folio:                                          number;
    Fecha_de_Registro:                              Date;
    Hora_de_Registro:                               string;
    Usuario_que_Registra:                           number;
    Descripcion:                                    string;
    Cuenta:                                         string;
    Contrato:                                       string;
    Producto_de_Credito:                            number;
    Deudor:                                         number;
    Informacion_Deudor:                             null;
    Esquema_de_Pago:                                null;
    Banco:                                          null;
    Cuenta_Bancaria:                                null;
    Referencia_Bancaria:                            string;
    Fecha_de_Prestamo:                              Date;
    Monto_Otorgado:                                 number;
    Saldo_Actual:                                   number;
    Saldo_Vencido:                                  number;
    Fecha_Ultimo_Pago:                              Date;
    Monto_del_Ultimo_Pago:                          number;
    Pago_Requerido:                                 null;
    Capital:                                        number;
    Capital_IVA:                                    number;
    Interes_Ordinario:                              number;
    Interes_Ordinario_IVA:                          number;
    Interes_Moratorio:                              number;
    Interes_Moratorio_IVA:                          number;
    Pago_Periodico:                                 number;
    Plazo_Contratado:                               string;
    Plazo_Remanente:                                string;
    Dias_de_Atraso:                                 number;
    Fecha_de_Reestructuracion:                      null;
    Fecha_Primer_Pago:                              Date;
    Fecha_fin_Contrato:                             Date;
    Fecha_de_Pago?:                                 any;
    Fecha_limite_de_Pago?:                          any;
    Dia_de_Corte:                                   number;
    Dias_para_Pago:                                 null;
    Interest_Moratorio:                             number;
    Tasa_de_Interes:                                number;
    Estatus:                                        number;
    Comentarios_Migracion:                          null;
    Destino_del_Credito:                            null;
    Describa_para_que_requiere_el_credito:          null;
    Marca:                                          null;
    Modelo:                                         null;
    Ano:                                            null;
    Precio_Comercial_del_Vehiculo:                  null;
    Tipo_de_Vivienda:                               null;
    Condicion_de_la_Vivienda:                       null;
    Precio:                                         null;
    antiguedad:                                     null;
    Saldo:                                          number;
    Detalle_de_Pagos:                               null;
    Usuario_que_Registra_Spartan_User:              UsuarioQueRegistraSpartanUser;
    Producto_de_Credito_Producto_de_Credito:        ProductoDeCreditoProductoDeCredito;
    Deudor_Deudor:                                  DeudorDeudor;
    Esquema_de_Pago_Esquema_de_Pagos:               BancoBanco;
    Banco_Banco:                                    BancoBanco;
    Estatus_Estatus_de_Credito:                     BancoBanco;
    Destino_del_Credito_Destino_del_Credito:        DestinoDelCreditoDestinoDelCredito;
    Marca_Marca_de_Vehiculo:                        BancoBanco;
    Tipo_de_Vivienda_Tipo_de_Vivienda:              BancoBanco;
    Condicion_de_la_Vivienda_Condicion_de_Vivienda: BancoBanco;
    Id:                                             number;
}

interface BancoBanco {
    Clave:       number;
    Descripcion: null | string;
    Id:          number;
}

interface DestinoDelCreditoDestinoDelCredito {
    Clave:                number;
    Descripcion:          null;
    Tipo:                 null;
    Tipo_Tipo_de_Credito: null;
    Id:                   number;
}

interface DeudorDeudor {
    Folio:                                      number;
    Fecha_de_Registro:                          null;
    Hora_de_Registro:                           null;
    Usuario_que_Registra:                       null;
    Tipo_de_Persona:                            null;
    RFC:                                        null;
    CURP:                                       null;
    Nombres:                                    null;
    Apellido_Paterno:                           null;
    Apellido_Materno:                           null;
    Nombre_Completo:                            string;
    Fecha_de_Nacimiento:                        null;
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
    Estatus:                                    null;
    Tipo_de_Vivienda_Actual:                    null;
    Empresa:                                    null;
    Actividad_o_Giro:                           null;
    Puesto:                                     null;
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
    Usuario_que_Registra_Spartan_User:          null;
    Tipo_de_Persona_Tipo_de_Persona:            null;
    Nacionalidad_Nacionalidad:                  null;
    Genero_Genero:                              null;
    Estado_Civil_Estado_Civil:                  null;
    Maximo_Grado_de_Estudios_Grado_de_Estudios: null;
    Tipo_de_Regimen_Tipo_de_Regimen:            null;
    Estatus_Estatus_de_Deudor:                  null;
    Tipo_de_Vivienda_Actual_Tipo_de_Vivienda:   null;
    Actividad_o_Giro_Giro_de_Negocio:           null;
    Estado_Estado:                              null;
    Ciudad_Ciudad:                              null;
    Id:                                         number;
}

interface ProductoDeCreditoProductoDeCredito {
    Folio:                           number;
    Descripcion:                     string;
    Ramo:                            null;
    Tipo_de_Credito:                 null;
    Pago_a_Capital:                  null;
    Pago_a_IVA_de_Capital:           null;
    Pago_a_Interes_Ordinario:        null;
    Pago_a_IVA_de_Interes_Ordinario: null;
    Pago_a_Interes_Moratorio:        null;
    Pago_a_IVA_de_Interes_Moratorio: null;
    Ramo_Ramo:                       null;
    Tipo_de_Credito_Tipo_de_Credito: null;
    Id:                              number;
}

interface UsuarioQueRegistraSpartanUser {
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
