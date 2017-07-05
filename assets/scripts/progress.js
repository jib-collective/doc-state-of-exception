const container = document.querySelector('.js-progressbar');
const bar = container.querySelector('.progressbar__progress');

const progress = (percentage) => {
  const normalized = percentage > 100 ? 100 : percentage;
  bar.style.width = `${normalized}%`;
};

export { progress };
