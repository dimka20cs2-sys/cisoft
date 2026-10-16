// Общая логика магазина (файл с "_" — не отдельный адрес, а модуль для функций /api/shop-*).
// Переменные окружения Vercel:
//   PAYPAL_ENV          — "sandbox" (тест) или "live"
//   PAYPAL_CLIENT_ID    — Client ID приложения PayPal
//   PAYPAL_SECRET       — Secret приложения PayPal (никогда не показывать на сайте)
//   LICENSE_PRIVATE_KEY — секретный ключ подписи лицензий (PEM, ECDSA P-256)
const crypto = require("crypto");

// Цены задаёт только сервер — то, что пришло со страницы, не учитывается.
const PRODUCTS = {
  "video-editor": { name: "FrameCut Pro", price: "3.99" },
  "duplicate-finder": { name: "Twins Pro", price: "3.99" },
  "uptime-monitor": { name: "UpWatch Pro", price: "4.99" },
  "pc-inventory": { name: "SpecSheet Pro", price: "2.99" },
  "net-scanner": { name: "NetRadar Pro", price: "2.99" },
  "mc-backup": { name: "CraftVault Pro", price: "1.99" },
  "port-monitor": { name: "PortWatch Pro", price: "1.99" },
  "service-manager": { name: "Servio Pro", price: "1.99" },
  "log-analyzer": { name: "LogLens Pro", price: "1.99" },
  "phone-info": { name: "Inside Pro", price: "0.99" },
  "net-tools": { name: "NetKit Pro", price: "0.99" },
  "mc-server-status": { name: "CraftPing Pro", price: "0.99" },
  "screen-recorder": { name: "RecCast Pro", price: "2.99" },
  "audio-converter": { name: "WaveShift Pro", price: "1.99" },
  "image-converter": { name: "PicPress Pro", price: "1.99" },
  "music-player": { name: "Melodia Pro", price: "1.99" },
  "cisoft-vpn": { name: "HopVPN Pro", price: "1.99" },
  "cisoft-lan": { name: "SquadLAN Pro", price: "2.99" },
  "mod-manager": { name: "ModNest Pro", price: "1.99" },
  "cleaner": { name: "Sweep Pro", price: "2.99" },
  "game-booster": { name: "TurboPlay Pro", price: "2.99" },
  "lagzero": { name: "LagZero Pro", price: "2.99" },
  "aimdot": { name: "AimDot Pro", price: "1.99" },
  "playhub": { name: "PlayHub Pro", price: "1.99" },
  "gametune": { name: "GameTune Pro", price: "2.99" },
  "senskit": { name: "SensKit Pro", price: "1.99" },
  "wakeup": { name: "WakeUp Pro", price: "0.99" },
  "remotedesk": { name: "RemoteDesk Pro", price: "1.99" },
  "boottime": { name: "BootTime Pro", price: "1.99" },
  "batterycare": { name: "BatteryCare Pro", price: "1.99" },
  "securedns": { name: "SecureDNS Pro", price: "1.99" },
  "wallguard": { name: "WallGuard Pro", price: "1.99" },
  "tempguard": { name: "TempGuard Pro", price: "1.99" },
  "driverview": { name: "DriverView Pro", price: "1.99" },
  "taskpilot": { name: "TaskPilot Pro", price: "1.99" },
  "netspeed": { name: "NetSpeed Pro", price: "0.99" },
  "shotsnap": { name: "ShotSnap Pro", price: "1.99" },
  "batchname": { name: "BatchName Pro", price: "1.99" },
  "vaultix": { name: "Vaultix Pro", price: "2.99" },
  "clipstack": { name: "ClipStack Pro", price: "1.99" },
  "beamdrop": { name: "BeamDrop Pro", price: "1.99" },
  "lanchat": { name: "LanChat Pro", price: "0.99" },
  "saveguard": { name: "SaveGuard Pro", price: "1.99" },
  "crafthost": { name: "CraftHost Pro", price: "2.99" },
  "gifforge": { name: "GifForge Pro", price: "1.99" },
  "voicenote": { name: "VoiceNote Pro", price: "1.99" },
  "powermode": { name: "PowerMode Pro", price: "1.99" },
  "updatecheck": { name: "UpdateCheck Pro", price: "1.99" },
  "snapback": { name: "SnapBack Pro", price: "1.99" },
  "shelltune": { name: "ShellTune Pro", price: "1.99" },
};
const CURRENCY = "USD";

function apiBase() {
  return process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

async function paypalToken() {
  const id = process.env.PAYPAL_CLIENT_ID, secret = process.env.PAYPAL_SECRET;
  if (!id || !secret) throw httpError(503, "Магазин ещё не настроен");
  const r = await fetch(apiBase() + "/v1/oauth2/token", {
    method: "POST",
    headers: { Authorization: "Basic " + Buffer.from(id + ":" + secret).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  if (!r.ok) throw httpError(502, "PayPal не отвечает, попробуйте позже");
  return (await r.json()).access_token;
}

async function paypal(method, path, body, extraHeaders) {
  const t = await paypalToken();
  const r = await fetch(apiBase() + path, {
    method,
    headers: Object.assign({ Authorization: "Bearer " + t, "Content-Type": "application/json" }, extraHeaders || {}),
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await r.text();
  let json = null;
  try { json = JSON.parse(text); } catch (e) { /* не JSON */ }
  return { status: r.status, json };
}

function b64url(buf) {
  return Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function signLicense(product, email, order) {
  const pem = (process.env.LICENSE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  if (!pem) throw httpError(503, "Выдача ключей не настроена");
  const payload = Buffer.from(JSON.stringify({ v: 1, p: product, e: email, o: order, t: Math.floor(Date.now() / 1000) }), "utf8");
  const sig = crypto.sign("sha256", payload, { key: pem, dsaEncoding: "ieee-p1363" });
  return "CISOFT-" + b64url(payload) + "." + b64url(sig);
}

// Проверяем оплаченный заказ и выдаём ключ. Возвращает { product, email, order, license }.
function licenseFromOrder(order) {
  if (!order || order.status !== "COMPLETED") throw httpError(402, "Заказ не оплачен");
  const unit = (order.purchase_units || [])[0] || {};
  const product = unit.custom_id;
  const info = PRODUCTS[product];
  if (!info) throw httpError(400, "Неизвестный товар");
  const cap = ((unit.payments || {}).captures || []).find((c) => c.status === "COMPLETED");
  if (!cap) throw httpError(402, "Платёж ещё не завершён");
  if (cap.amount.currency_code !== CURRENCY || cap.amount.value !== info.price) throw httpError(400, "Сумма оплаты не совпадает с ценой");
  const email = ((order.payer || {}).email_address || "").toLowerCase();
  return { product, name: info.name, email, order: order.id, license: signLicense(product, email, order.id) };
}

function httpError(status, message) { const e = new Error(message); e.status = status; return e; }

function send(res, status, data) {
  res.setHeader("Cache-Control", "no-store");
  res.status(status).json(data);
}

function handler(fn) {
  return async (req, res) => {
    try {
      if (req.method !== "POST" && req.method !== "GET") return send(res, 405, { error: "Метод не поддерживается" });
      await fn(req, res);
    } catch (e) {
      send(res, e.status || 500, { error: e.status ? e.message : "Внутренняя ошибка, попробуйте ещё раз" });
      if (!e.status) console.error(e);
    }
  };
}

const validOrderId = (s) => typeof s === "string" && /^[A-Z0-9]{10,30}$/.test(s);

module.exports = { PRODUCTS, CURRENCY, paypal, licenseFromOrder, httpError, send, handler, validOrderId };
