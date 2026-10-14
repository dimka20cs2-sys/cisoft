// POST /api/shop-capture { orderId } → { product, name, email, order, license }
// Списывает оплату по одобренному заказу, проверяет сумму и товар, выдаёт подписанный ключ.
// Повторный вызов для уже оплаченного заказа просто выдаёт ключ ещё раз.
const { paypal, licenseFromOrder, httpError, send, handler, validOrderId } = require("./_shop");

module.exports = handler(async (req, res) => {
  const orderId = (req.body || {}).orderId;
  if (!validOrderId(orderId)) throw httpError(400, "Неверный номер заказа");
  let r = await paypal("POST", "/v2/checkout/orders/" + orderId + "/capture", {}, { "PayPal-Request-Id": "cap-" + orderId });
  if (r.status === 422) r = await paypal("GET", "/v2/checkout/orders/" + orderId); // уже списан ранее
  if (r.status === 404) throw httpError(404, "Заказ не найден");
  if (!r.json || r.status >= 400) throw httpError(402, "Оплата не прошла. Деньги не списаны — попробуйте ещё раз.");
  send(res, 200, licenseFromOrder(r.json));
});
