import 'fg-loadcss/src/loadCSS';
import 'fg-loadcss/src/cssrelpreload';

import domready from 'domready';
import { init as slider } from './slider';
import { init as fullscreen } from './fullscreen';

domready(() => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  slider();
  fullscreen();

  // hide iOS address bar
  if (isIOS) {
    setTimeout(() => window.scrollTo(0, 1), 0);
  }
});
