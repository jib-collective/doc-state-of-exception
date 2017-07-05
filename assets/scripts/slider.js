import { lory } from 'lory.js';

const init = () => {
  let loryInstance;
  const slider = document.querySelector('.js-slider');
  const slides = [...slider.querySelectorAll('.js-slide')];

  const getSlideByIndex = index => {
    return slides[index] || undefined;
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

  slider.addEventListener('before.lory.slide', preloadNextImages);
  document.addEventListener('keydown', handleKeys);
};

export { init };
