import _ from 'lodash';

const propertyActions = [
  {
    check: value => value instanceof Object,
    process: () => 'complex value',
  },
  {
    check: (value, type) => !(value instanceof Object) && type === 'modified',
    process: value => `'${value}'`,
  },
  {
    check: value => !(value instanceof Object),
    process: value => `value: '${value}'`,
  },
];

const getValue = (value, type) => {
  const { process } = _.find(propertyActions, ({ check }) => check(value, type));
  return process(value);
};

const getPath = path => `Property '${path.join('.')}' was`;

const outputStrings = {
  nested: (p, path, f) => f(p.children, path),
  added: (p, path) => `${getPath(path)} added with ${
    getValue(p.value)}`,
  deleted: (p, path) => `${getPath(path)} removed`,
  modified: (p, path) => `${getPath(path)} updated. From ${
    getValue(p.value.beforeChange, p.type)} to ${
    getValue(p.value.afterChange, p.type)}`,
};

const plainRenderer = (ast, path = []) => {
  const unchanged = ast.filter(e => e.type !== 'unchanged');
  const mapper = (p) => {
    const fullPath = [...path, p.name];
    const getOutputStr = outputStrings[p.type];
    const rendererStr = getOutputStr(p, fullPath, plainRenderer);
    return rendererStr;
  };
  const result = unchanged.map(mapper);
  return _.flatten(result).join('\n');
};

export default plainRenderer;
