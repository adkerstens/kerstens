document.querySelector('[data-load-social-video]')?.addEventListener('click', () => {
  const frame = document.createElement('iframe');
  frame.src = 'https://www.instagram.com/reel/DYAe7PJsLdB/embed/';
  frame.title = 'Warrior in het wild — humoristische video voor Universe Festival';
  frame.allow = 'encrypted-media; fullscreen; picture-in-picture';
  frame.allowFullscreen = true;
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  document.querySelector('[data-social-video-frame]').replaceChildren(frame);
  document.querySelector('[data-social-video-choice]').remove();
  frame.focus();
}, { once: true });
