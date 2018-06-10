import getStandartRender from './standartRender';
import getPlainRender from './plainRender';

const renderers = {
  default: getStandartRender,
  plain: getPlainRender,
  json: ast => JSON.stringify(ast, null, 2),
};

export default format => (data) => {
  const render = renderers[format];
  return render(data);
};
