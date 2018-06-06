import { safeLoad } from 'js-yaml';
import ini from 'ini';

export default (format) => {
  const parsers = {
    '.json': JSON.parse,
    '.yaml': safeLoad,
    '.yml': safeLoad,
    '.ini': ini.parse,
  };
  return (data) => {
    const parse = parsers[format];
    return parse(data);
  };
};
