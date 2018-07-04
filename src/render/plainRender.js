import _ from 'lodash';

const getChangeOptions = [
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

const getChange = (value, type) => {
  const { action } = _.find(getChangeOptions, ({ check }) => check(value, type));
  return action(value);
};

const getKey = path => `Property '${path.join('.')}' was`;

const strings = {
  nested: (p, path, f) => f(p.children, path),
  added: (p, path) => `${getKey(path)} added with ${
    getChange(p.value)}`,
  deleted: (p, path) => `${getKey(path)} removed`,
  modified: (p, path) => `${getKey(path)} updated. From ${
    getChange(p.value.old, p.type)} to ${
    getChange(p.value.new, p.type)}`,
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
