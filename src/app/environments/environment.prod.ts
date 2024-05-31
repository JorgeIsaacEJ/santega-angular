export const environment = {
  production: true,
  //api: 'http://108.181.200.246/WebApicobranza',
  //api: 'http://localhost/WebApicobranza',
  api: 'http://www.santega.com', /* PROD */
  version: 'api/v1',
  secretCrypto: 'ecinco#BF4.TT.T5RB0',
  nuvei: {
    merchantId: '7503723445257421239',
    siteId: '248868',
    secretKey: 'o30IbzHnpBxOactKPNdNum7ITpJvCbIVCKbJNKpbnWttwVgPckqaU2HmCNyq9jlD',
    successURL: 'https://sandbox.nuvei.com/lib/demo_process_request/response.php',
    failureURL: 'https://ppp-test.safecharge.com/ppp/defaultCancel.do',
    paymentURL: 'https://ppp-test.safecharge.com/ppp/purchase.do',
  },
      //Paycash
      apipaycash: "https://sb-api-mexico-emisor.paycashglobal.com/",
      idpaycash: 473,
      keypaycash: "a5157d8d984011eebae60aec000473000",
};