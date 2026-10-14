// POST /api/shop-create { product } → { id } — создаёт заказ PayPal по цене с сервера.
const { PRODUCTS, CURRENCY, paypal, httpError, send, handler } = require("./_shop");

module.exports = handler(async (req, res) => {
  const product = (req.body || {}).product;
  const info = PRODUCTS[product];
  if (!info) throw httpError(400, "Неизвестный товар");
  const r = await paypal("POST", "/v2/checkout/orders", {
    intent: "CAPTURE",
    purchase_units: [{
      custom_id: product,
      description: info.name + " — лицензия",
      amount: { currency_code: CURRENCY, value: info.price },
    }],
    application_context: { brand_name: "CISOFT", shipping_preference: "NO_SHIPPING", user_action: "PAY_NOW" },
  });
  if (r.status !== 201 || !r.json || !r.json.id) throw httpError(502, "Не удалось создать заказ в PayPal");
  send(res, 200, { id: r.json.id });
});
