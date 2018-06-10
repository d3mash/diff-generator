import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import getParser from './parsers';
import render from './render';

const actions = [
  {
    type: 'nested',
    check: (old, updated, key) => !(old[key] instanceof Array && updated[key] instanceof Array) &&
    (old[key] instanceof Object && updated[key] instanceof Object),
    setValue: (old, updated, key, f) => ({ children: (f(old[key], updated[key])) }),
  },
  {
    type: 'added',
    check: (old, updated, key) => !_.has(old, key),
    setValue: (old, updated, key) => ({ value: updated[key] }),
  },
  {
    type: 'deleted',
    check: (old, updated, key) => !_.has(updated, key),
    setValue: (old, updated, key) => ({ value: old[key] }),
  },
  {
    type: 'modified',
    check: (old, updated, key) => !(old[key] instanceof Object && updated[key] instanceof Object)
    && (old[key] !== updated[key]),
    setValue: (old, updated, key) =>
      ({ value: { beforeChange: old[key], afterChange: updated[key] } }),
  },
  {
    type: 'unchanged',
    check: (old, updated, key) => old[key] === updated[key],
    setValue: (old, updated, key) => ({ value: old[key] }),
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
export default (file1, file2) => {
  const format = path.extname(file1);
  const parse = getParser(format);
  const old = parse(fs.readFileSync(file1, 'utf-8'));
  const updated = parse(fs.readFileSync(file2, 'utf-8'));
  const diffAst = getAst(old, updated);
  return `{\n${render(diffAst, 1)}\n}\n`;
};
