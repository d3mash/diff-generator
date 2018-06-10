import getStandartRender from './standartRender';
// import getPlainRenderer from './plainRender';
// import getJsonRenderer from './jsonRender';

const renderers = {
  default: getStandartRender,
  // plain: getPlainRenderer,
  // json: getJsonRenderer,
};

export default format => (data) => {
  const render = renderers[format];
  if (!render) {
    throw new Error('unkown format');
  }
  return render(data);
};
