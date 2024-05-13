export interface RegistroDePagoPost{
    Folio: number;
    Fecha_de_Registro: string;
    Hora_de_Registro: string;
    Usuario_que_Registra: number;
    Deudor: number;
    Credito: number;
    No__Cuenta: string;
    No__Contrato: string;
    Producto_de_Credito: number;
    Fecha_de_Prestamo: null;
    Monto_Otorgado: null;
    Saldo_Actual: null;
    Plazo_Contratado: null;
    Plazo_Remanente: null;
    Dias_de_Atraso: null;
    Dia_de_Corte: null;
    Dias_para_Pago: null;
    Medio_de_Pago: number;
    No__de_Referencia: string;
    Total_a_Pagar: null;
    Total_Pagado: number;
    Pago_a_Capital: null;
    Pago_a_IVA_de_Capital: null;
    Pago_a_Comison_de_Admon__de_Cuenta: null;
    Pago_a_IVA_de_Comision: null;
    Pago_a_Interes: null;
    Pago_a_IVA_de_Interes: null;
    Pago_a_Moratorios: null;
    Pago_a_IVA_Mora: null;
    Saldo: null
    Fecha_de_Registro_Sistema: null;
    Gastos_Administrativos: null;
    IVA_Gastos_Administrativos: null;
    Seguro_Vida: null;
    Seguro_Danos: null;
    GPS: null;
    Archivo: null;
    Consecutivo_Pago: null;
}