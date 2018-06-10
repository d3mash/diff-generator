import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import getParser from './parsers';
import chooseRender from './render';

const actions = [
  {
    type: 'nested',
    check: (old, New, key) => !(old[key] instanceof Array && New[key] instanceof Array) &&
    (old[key] instanceof Object && New[key] instanceof Object),
    setValue: (old, New, key, f) => ({ children: (f(old[key], New[key])) }),
  },
  {
    type: 'added',
    check: (old, New, key) => !_.has(old, key),
    setValue: (old, New, key) => ({ value: New[key] }),
  },
  {
    type: 'deleted',
    check: (old, New, key) => !_.has(New, key),
    setValue: (old, New, key) => ({ value: old[key] }),
  },
  {
    type: 'modified',
    check: (old, New, key) => !(old[key] instanceof Object && New[key] instanceof Object)
    && (old[key] !== New[key]),
    setValue: (old, New, key) =>
      ({ value: { beforeChange: old[key], afterChange: New[key] } }),
  },
  {
    type: 'unchanged',
    check: (old, New, key) => old[key] === New[key],
    setValue: (old, New, key) => ({ value: old[key] }),
  },
];

const getActions = (a, b, key) =>
  _.find(actions, ({ check }) => check(a, b, key));

const getAst = (file1, file2) => {
  const allKeys = _.union(Object.keys(file1), Object.keys(file2));
  const parseProperty = (element) => {
    const { type, setValue } = getActions(file1, file2, element);
    return { type, name: element, ...setValue(file1, file2, element, getAst) };
  };
  const AST = allKeys.map(parseProperty);
  return AST;
};
export default (file1, file2, format = 'default') => {
  const fileFormat = path.extname(file1);
  const parse = getParser(fileFormat);
  const old = parse(fs.readFileSync(file1, 'utf-8'));
  const New = parse(fs.readFileSync(file2, 'utf-8'));
  const diffAst = getAst(old, New);
  const render = chooseRender(format);
  return render(diffAst);
};
