import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import getParser from './parsers';
import chooseRender from './render';

const actions = [
  {
    type: 'nested',
    check:
      (before, updated, key) => !(before[key] instanceof Array && updated[key] instanceof Array) &&
      (before[key] instanceof Object && updated[key] instanceof Object),
    action: (before, updated, key, f) => ({ children: (f(before[key], updated[key])) }),
  },
  {
    type: 'added',
    check: (before, updated, key) => !_.has(before, key),
    action: (before, updated, key) => ({ value: updated[key] }),
  },
  {
    type: 'deleted',
    check: (before, updated, key) => !_.has(updated, key),
    action: (before, updated, key) => ({ value: before[key] }),
  },
  {
    type: 'modified',
    check: (before, updated, key) =>
      !(before[key] instanceof Object && updated[key] instanceof Object)
      && (before[key] !== updated[key]),
    action: (before, updated, key) =>
      ({ value: { beforeChange: before[key], afterChange: updated[key] } }),
  },
  {
    type: 'unchanged',
    check: (before, updated, key) => before[key] === updated[key],
    action: (before, updated, key) => ({ value: before[key] }),
  },
];

const getActions = (a, b, key) =>
  _.find(actions, ({ check }) => check(a, b, key));

const getAst = (file1, file2) => {
  const allKeys = _.union(Object.keys(file1), Object.keys(file2));
  const parseProperty = (element) => {
    const { type, action } = getActions(file1, file2, element);
    return { type, name: element, ...action(file1, file2, element, getAst) };
  };
  const AST = allKeys.map(parseProperty);
  return AST;
};
export default (file1, file2, format = 'default') => {
  const fileFormat = path.extname(file1);
  const parse = getParser(fileFormat);
  const before = parse(fs.readFileSync(file1, 'utf-8'));
  const after = parse(fs.readFileSync(file2, 'utf-8'));
  const diffAst = getAst(before, after);
  const render = chooseRender(format);
  return render(diffAst);
};
