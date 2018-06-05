import _ from 'lodash';
import fs from 'fs';

export default (file1, file2) => {
  const parse = path => JSON.parse(fs.readFileSync(path, 'utf8'));
  const configOne = parse(file1);
  const configTwo = parse(file2);
  const mapping = [
    {
      check: (old, updated, prop) => !_.has(old, prop),
      setValue: (old, updated, prop) => [`+ ${prop}`, updated[prop]],
    },
    {
      check: (old, updated, prop) => !_.has(updated, prop),
      setValue: (old, updated, prop) => [`- ${prop}`, old[prop]],
    },
    {
      check: (old, updated, prop) => old[prop] !== updated[prop],
      setValue: (old, updated, prop) => [`- ${prop}`, `${old[prop]}`, `+ ${prop}`, `${updated[prop]}`],
    },
    {
      check: (old, updated, prop) => old[prop] === updated[prop],
      setValue: (old, updated, prop) => [`${prop}`, old[prop]],
    },
  ];
  const allKeys = Object.keys(configOne).concat(Object.keys(configTwo));
  const output = {};
  const difference = allKeys.reduce((acc, element) => {
    const { setValue } = _.find(mapping, ({ check }) => check(configOne, configTwo, element));
    const prop = setValue(configOne, configTwo, element);
    return prop[2] === undefined ? { ...acc, [prop[0]]: prop[1] } :
      { ...acc, [prop[0]]: prop[1], [prop[2]]: prop[3] };
  }, output);
  return difference;
};
