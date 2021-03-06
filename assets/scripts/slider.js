import { lory } from 'lory.js';
import { progress } from './progress';
import { toggleCaption } from './caption';

const init = () => {
  let loryInstance;
  let activeImage;
  const slider = document.querySelector('.js-slider');
  const slides = [...slider.querySelectorAll('.js-slide')];
  const info = document.querySelector('.js-info');

  const getSlideByIndex = index => {
    return slides[index] || undefined;
  };

  const updateProgress = (event) => {
    const nextSlideIndex = event.detail.nextSlide;
    progress(parseInt((nextSlideIndex + 1) * 100 / slides.length, 10));
  };

  const preloadNextImages = (event) => {
    const preloadImages = slide => {
      const images = [...slide.querySelectorAll('.js-lazy-image')];

      images.forEach(image => {
        const data = image.dataset;

        requestAnimationFrame(() => {
          if (data.srcset) {
            image.setAttribute('srcset', data.srcset);
          }

          if (data.src) {
            image.setAttribute('src', data.src);
          }
        });
      });
    };

    const nextSlideIndex = event.detail.nextSlide;

    if (nextSlideIndex) {
      // preload next slides
      for(let i = 0; i <= 2; ++i) {
        const moreSlide = getSlideByIndex(nextSlideIndex + i);

        if (moreSlide) {
          preloadImages(moreSlide);
        }
      }
    }
  };

  const handleKeys = event => {
    const { keyCode } = event;

    switch(keyCode) {
      case 39:
      case 40:
        loryInstance.next();
        break;

      case 37:
      case 38:
        loryInstance.prev();
        break;
    }
  };

  loryInstance = lory(slider, {
    classNameFrame: 'slider__frame',
    classNameSlideContainer: 'slider__slides',
    enableMouseEvents: true,
  });

  slider.addEventListener('before.lory.slide', (event) => {
    const slide = getSlideByIndex(event.detail.nextSlide);
    const image = slide && slide.querySelector('.image');
    const fullscreen = document.querySelector('.js-fullscreen');

    preloadNextImages(event);
    updateProgress(event);

    if (fullscreen) {
      fullscreen.classList.toggle('fullscreen--tiny', event.detail.nextSlide > 1);
    }

    activeImage = image

    if (info) {
      info.classList.toggle('info--decent', !!image);
    }
  });

  document.addEventListener('keydown', handleKeys);

  info.addEventListener('click', event => {
    event.preventDefault();
    toggleCaption(activeImage);
  });
};

export { init };
