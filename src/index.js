import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import getParser from './parsers';
import chooseRender from './render';

const actions = [
  {
    type: 'nested',
    check:
      (before, after, key) => !(before[key] instanceof Array && after[key] instanceof Array) &&
      (before[key] instanceof Object && after[key] instanceof Object),
    action: (before, after, key, f) => ({ children: (f(before[key], after[key])) }),
  },
  {
    type: 'added',
    check: (before, after, key) => !_.has(before, key),
    action: (before, after, key) => ({ value: after[key] }),
  },
  {
    type: 'deleted',
    check: (before, after, key) => !_.has(after, key),
    action: (before, after, key) => ({ value: before[key] }),
  },
  {
    type: 'modified',
    check: (before, after, key) =>
      !(before[key] instanceof Object && after[key] instanceof Object)
      && (before[key] !== after[key]),
    action: (before, after, key) =>
      ({ value: { old: before[key], new: after[key] } }),
  },
  {
    type: 'unchanged',
    check: (before, after, key) => before[key] === after[key],
    action: (before, after, key) => ({ value: before[key] }),
  },
];

const getActions = (before, after, property) =>
  _.find(actions, ({ check }) => check(before, after, property));

const getAst = (before, after) => {
  const allProps = _.union(Object.keys(before), Object.keys(after));
  const parseProperty = (property) => {
    const { type, action } = getActions(before, after, property);
    return { type, name: property, ...action(before, after, property, getAst) };
  };
  const ast = allProps.map(parseProperty);
  return ast;
};
export default (path1, path2, format = 'default') => {
  const fileFormat = path.extname(path1);
  const parse = getParser(fileFormat);
  const oldConfig = parse(fs.readFileSync(path1, 'utf-8'));
  const newConfig = parse(fs.readFileSync(path2, 'utf-8'));
  const diff = getAst(oldConfig, newConfig);
  const render = chooseRender(format);
  return render(diff);
};
