export interface DebtModel {
    Ramo_Ramo:                       null;
    Tipo_de_Credito_Tipo_de_Credito: null;
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
    Id:                              number;
}
export interface PagosReferencia {
    Referencia_Bancaria: string;
    Pago_Periodico: number;
  }