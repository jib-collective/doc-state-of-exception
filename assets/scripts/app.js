import 'fg-loadcss/src/loadCSS';
import 'fg-loadcss/src/cssrelpreload';

import domready from 'domready';
import { init as slider } from './slider';

domready(() => {
  slider();
});
