// POST /api/shop-recover { orderId, email } → ключ заново, если заказ оплачен этим email.
// Номер заказа есть в письме-чеке PayPal у покупателя.
const { paypal, licenseFromOrder, httpError, send, handler, validOrderId } = require("./_shop");

module.exports = handler(async (req, res) => {
  const body = req.body || {};
  const orderId = String(body.orderId || "").trim().toUpperCase();
  const email = String(body.email || "").trim().toLowerCase();
  if (!validOrderId(orderId) || !email) throw httpError(400, "Укажите номер заказа и email");
  const r = await paypal("GET", "/v2/checkout/orders/" + orderId);
  if (r.status === 404 || !r.json) throw httpError(404, "Заказ не найден");
  const result = licenseFromOrder(r.json);
  if (result.email !== email) throw httpError(403, "Email не совпадает с email покупателя в PayPal");
  send(res, 200, result);
});
