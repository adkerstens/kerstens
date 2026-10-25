document.querySelector('[data-load-soundcloud]')?.addEventListener('click', () => {
  const frame = document.createElement('iframe');
  frame.src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent('https://soundcloud.com/ad-kerstens/vwab-2025-warm-up-by-mc-warrior') + '&auto_play=false&hide_related=true&show_comments=false&show_user=true&visual=false';
  frame.title = 'MC Warrior — Vroeger Was Alles Beter 2025 Warm-Up';
  frame.height = '240';
  frame.allow = 'autoplay';
  document.querySelector('[data-soundcloud-player]').replaceChildren(frame);
  document.querySelector('[data-soundcloud-choice]').remove();
}, { once: true });
