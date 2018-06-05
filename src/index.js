import { safeLoad } from 'js-yaml';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';

const getParser = (format) => {
  const parsers = {
    json: JSON.parse,
    yaml: safeLoad,
    yml: safeLoad,
  };
  return (data) => {
    const parse = parsers[format];
    return parse(data);
  };
};
const mapping = [
  {
    check: (old, updated, prop) => !_.has(old, prop), // added
    setValue: (old, updated, prop) => `+ ${prop}: ${updated[prop]}`,
  },
  {
    check: (old, updated, prop) => !_.has(updated, prop), // deleted
    setValue: (old, updated, prop) => `- ${prop}: ${old[prop]}`,
  },
  {
    check: (old, updated, prop) => old[prop] !== updated[prop], // modified
    setValue: (old, updated, prop) => [`- ${prop}: ${old[prop]}`, `+ ${prop}: ${updated[prop]}`],
  },
  {
    check: (old, updated, prop) => old[prop] === updated[prop], // unchanged
    setValue: (old, updated, prop) => `${prop} : ${old[prop]}`,
  },
];

const getContent = pathToFile => fs.readFileSync(pathToFile, 'utf-8');

export default (file1, file2) => {
  const format = path.extname(file1).slice(1);
  const parse = getParser(format);
  const configOne = parse(getContent(file1));
  const configTwo = parse(getContent(file2));
  const allKeys = _.union(Object.keys(configOne), Object.keys(configTwo));
  const results = allKeys.map((key) => {
    const { setValue } = _.find(mapping, ({ check }) => check(configOne, configTwo, key));
    return setValue(configOne, configTwo, key);
  });
  return `{\n${_.flatten(results).join('\n')}\n}\n`;
};
