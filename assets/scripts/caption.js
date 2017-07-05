const getCaption = (image) => {
  return image.querySelector('.image__caption');
};

const showCaption = (image) => {
  const caption = getCaption(image);

  caption.style.maxHeight = '100px';
};

const hideCaption = (image) => {
  const caption = getCaption(image);

  caption.style.maxHeight = '0px';
};

export { showCaption, hideCaption };
