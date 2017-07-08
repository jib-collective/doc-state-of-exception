import screenfull from 'screenfull';

const init = () => {
  const trigger = document.querySelector('.js-fullscreen');

  if (screenfull.enabled) {
    screenfull.onchange(() => {
      trigger.style.display = screenfull.isFullscreen ? 'none' : 'block';
      document.body.classList.toggle('is-fullscreen', screenfull.isFullscreen);
    });
  }

  if (trigger) {
    if (!screenfull.enabled) {
      trigger.style.display = 'none';
    }

    trigger.addEventListener('click', event => {
      event.preventDefault();
      screenfull.request();
    });
  }
};

export { init };