import screenfull from 'screenfull';

const init = () => {
  const trigger = document.querySelector('.js-fullscreen');

  screenfull.onchange(() => {
    if (screenfull.isFullscreen) {
      trigger.style.display = 'none';
    } else {
      trigger.style.display = 'block';
    }
  });

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