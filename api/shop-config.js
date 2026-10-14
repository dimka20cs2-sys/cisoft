// GET /api/shop-config — публичные настройки магазина для страницы (Client ID, цены).
const { PRODUCTS, CURRENCY, send, handler } = require("./_shop");

module.exports = handler(async (req, res) => {
  const clientId = process.env.PAYPAL_CLIENT_ID || "";
  send(res, 200, {
    ready: !!(clientId && process.env.PAYPAL_SECRET && process.env.LICENSE_PRIVATE_KEY),
    clientId,
    env: process.env.PAYPAL_ENV === "live" ? "live" : "sandbox",
    currency: CURRENCY,
    products: PRODUCTS,
  });
});
