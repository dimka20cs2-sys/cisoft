// Простая панель популярных эмодзи.
import { el } from './dom.js';

const EMOJI = ('😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 😉 😍 🥰 😘 😋 😜 🤪 😎 🤩 🥳 😏 😒 😔 😢 😭 😤 😡 🤯 😳 😱 🤔 ' +
  '🤗 🤭 🙄 😴 🤤 😷 🤒 🤕 🥶 🥵 😈 👻 💩 🤡 👍 👎 👌 ✌️ 🤞 🤝 👏 🙌 🙏 💪 👋 🤙 ' +
  '❤️ 🧡 💛 💚 💙 💜 🖤 💔 💯 🔥 ✨ ⭐ 🎉 🎁 🎂 ☕ 🍕 🍺 ⚽ 🚗 ✈️ 🏠 💻 📱 📷 ⏰ ✅ ❌ ❓ ❗').split(' ');

export function createEmojiPanel(onPick, onClose) {
  const panel = el('div', { class: 'emoji-panel', role: 'dialog', 'aria-label': 'Эмодзи' },
    EMOJI.map((e) => el('button', { type: 'button', text: e, title: e, onclick: () => onPick(e) })));
  const outside = (ev) => {
    if (!panel.contains(ev.target) && !ev.target.closest('[data-emoji-toggle]')) close();
  };
  const key = (ev) => { if (ev.key === 'Escape') close(); };
  function close() {
    panel.remove();
    document.removeEventListener('mousedown', outside);
    document.removeEventListener('keydown', key);
    onClose?.();
  }
  setTimeout(() => {
    document.addEventListener('mousedown', outside);
    document.addEventListener('keydown', key);
  });
  return { panel, close };
}
