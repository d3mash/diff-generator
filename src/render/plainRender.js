import _ from 'lodash';

const values = [
  {
    check: value => value instanceof Object,
    action: () => 'complex value',
  },
  {
    check: (value, type) => !(value instanceof Object) && type === 'modified',
    action: value => `'${value}'`,
  },
  {
    check: value => !(value instanceof Object),
    action: value => `value: '${value}'`,
  },
];

const getValue = (value, type) => {
  const { action } = _.find(values, ({ check }) => check(value, type));
  return action(value);
};

const getFirstPart = path => `Property '${path.join('.')}' was`;

const strings = {
  nested: (p, path, f) => f(p.children, path),
  added: (p, path) => `${getFirstPart(path)} added with ${
    getValue(p.value)}`,
  deleted: (p, path) => `${getFirstPart(path)} removed`,
  modified: (p, path) => `${getFirstPart(path)} updated. From ${
    getValue(p.value.beforeChange, p.type)} to ${
    getValue(p.value.afterChange, p.type)}`,
};

const plainRenderer = (ast, path = []) => {
  const unchanged = ast.filter(e => e.type !== 'unchanged');
  const mapper = (p) => {
    const fullPath = [...path, p.name];
    const getOutputStr = strings[p.type];
    const rendererStr = getOutputStr(p, fullPath, plainRenderer);
    return rendererStr;
  };
  const result = unchanged.map(mapper);
  return _.flatten(result).join('\n');
};

export default plainRenderer;
