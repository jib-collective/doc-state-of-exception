const getCaption = (image) => {
  return image.querySelector('.image__caption');
};

const showCaption = (image) => {
  const caption = getCaption(image);

  caption.setAttribute('data-caption-open', 'true');
  caption.style.maxHeight = '100px';
};

const hideCaption = (image) => {
  const caption = getCaption(image);

  caption.setAttribute('data-caption-open', 'false');
  caption.style.maxHeight = '0px';
};

const toggleCaption = (image) => {
  const caption = getCaption(image);
  const openAttr = caption.getAttribute('data-caption-open');

  if (openAttr === null || openAttr === 'false') {
    showCaption(image);
  } else {
    hideCaption(image);
  }
};

export { showCaption, hideCaption, toggleCaption };
