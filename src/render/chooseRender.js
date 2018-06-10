import getStandartRender from './standartRender';
import getPlainRender from './plainRender';
import getJsonRender from './jsonRender';

const renderers = {
  default: getStandartRender,
  plain: getPlainRender,
  json: getJsonRender,
};

export default format => (data) => {
  const render = renderers[format];
  return render(data);
};
