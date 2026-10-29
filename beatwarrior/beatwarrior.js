// The download stays a normal link: following Instagram is always optional.
const notice = document.querySelector('.download-thanks');
let hideTimer;
for (const link of document.querySelectorAll('a.download')) {
  link.addEventListener('click', () => {
    if (!notice) return;
    notice.hidden = false;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { notice.hidden = true; }, 20000);
  });
}
notice?.querySelector('button')?.addEventListener('click', () => {
  notice.hidden = true;
  clearTimeout(hideTimer);
});
