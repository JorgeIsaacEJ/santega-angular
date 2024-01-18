export interface UserHistoryPaymentsResponse {
    Registro_de_Pagos: RegistroDePago[];
    RowCount:          number;
}

export interface RegistroDePago {
    Folio:                                   number;
    Fecha_de_Registro:                       Date;
    Hora_de_Registro:                        null;
    Usuario_que_Registra:                    number;
    Deudor:                                  number;
    Credito:                                 number;
    No__Cuenta:                              string;
    No__Contrato:                            string;
    Producto_de_Credito:                     number | null;
    Fecha_de_Prestamo:                       null;
    Monto_Otorgado:                          null;
    Saldo_Actual:                            null;
    Plazo_Contratado:                        null;
    Plazo_Remanente:                         null;
    Dias_de_Atraso:                          null;
    Dia_de_Corte:                            null;
    Dias_para_Pago:                          null;
    Medio_de_Pago:                           number;
    No__de_Referencia:                       null;
    Total_a_Pagar:                           null;
    Total_Pagado:                            number;
    Pago_a_Capital:                          number;
    Pago_a_IVA_de_Capital:                   null;
    Pago_a_Comison_de_Admon__de_Cuenta:      null;
    Pago_a_IVA_de_Comision:                  null;
    Pago_a_Interes:                          number;
    Pago_a_IVA_de_Interes:                   null;
    Pago_a_Moratorios:                       number;
    Pago_a_IVA_Mora:                         null;
    Saldo:                                   null;
    Usuario_que_Registra_Spartan_User:       UsuarioQueRegistraSpartanUser;
    Deudor_Deudor:                           DeudorDeudor;
    Credito_Credito:                         CreditoCredito;
    Producto_de_Credito_Producto_de_Credito: ProductoDeCreditoProductoDeCredito;
    Medio_de_Pago_Medio_de_Pago:             MedioDePagoMedioDePago;
    Id:                                      number;
}

interface CreditoCredito {
    Folio:                                          number;
    Fecha_de_Registro:                              null;
    Hora_de_Registro:                               null;
    Usuario_que_Registra:                           null;
    Descripcion:                                    string;
    Cuenta:                                         null;
    Contrato:                                       null;
    Producto_de_Credito:                            null;
    Deudor:                                         null;
    Informacion_Deudor:                             null;
    Esquema_de_Pago:                                null;
    Banco:                                          null;
    Cuenta_Bancaria:                                null;
    Referencia_Bancaria:                            null;
    Fecha_de_Prestamo:                              null;
    Monto_Otorgado:                                 null;
    Saldo_Actual:                                   null;
    Saldo_Vencido:                                  null;
    Fecha_Ultimo_Pago:                              null;
    Monto_del_Ultimo_Pago:                          null;
    Pago_Requerido:                                 null;
    Capital:                                        null;
    Capital_IVA:                                    null;
    Interes_Ordinario:                              null;
    Interes_Ordinario_IVA:                          null;
    Interes_Moratorio:                              null;
    Interes_Moratorio_IVA:                          null;
    Pago_Periodico:                                 null;
    Plazo_Contratado:                               null;
    Plazo_Remanente:                                null;
    Dias_de_Atraso:                                 null;
    Fecha_de_Reestructuracion:                      null;
    Fecha_Primer_Pago:                              null;
    Fecha_fin_Contrato:                             null;
    Dia_de_Corte:                                   null;
    Dias_para_Pago:                                 null;
    Interest_Moratorio:                             null;
    Tasa_de_Interes:                                null;
    Estatus:                                        null;
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
    Saldo:                                          null;
    Detalle_de_Pagos:                               null;
    Usuario_que_Registra_Spartan_User:              null;
    Producto_de_Credito_Producto_de_Credito:        null;
    Deudor_Deudor:                                  null;
    Esquema_de_Pago_Esquema_de_Pagos:               null;
    Banco_Banco:                                    null;
    Estatus_Estatus_de_Credito:                     null;
    Destino_del_Credito_Destino_del_Credito:        null;
    Marca_Marca_de_Vehiculo:                        null;
    Tipo_de_Vivienda_Tipo_de_Vivienda:              null;
    Condicion_de_la_Vivienda_Condicion_de_Vivienda: null;
    Id:                                             number;
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
    Nombre_Completo:                            NombreCompleto;
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

enum NombreCompleto {
    OscarGonzalezDelBosque = "OSCAR  GONZALEZ DEL BOSQUE",
}

interface MedioDePagoMedioDePago {
    Clave:       number;
    Descripcion: MedioDePagoMedioDePagoDescripcion;
    Id:          number;
}

enum MedioDePagoMedioDePagoDescripcion {
    Afirme = "Afirme",
    Histórico = "Histórico",
    Pago = "PAGO",
}

interface ProductoDeCreditoProductoDeCredito {
    Folio:                           number;
    Descripcion:                     string | null;
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
    Name:                       Name;
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

enum Name {
    Administrador = "Administrador",
}
