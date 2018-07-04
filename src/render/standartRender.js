import _ from 'lodash';

const stringifyOptions = [
  {
    check: e => (e instanceof Object && !(e instanceof Array)),
    action: (property, value, l) => {
      const convertObjToString = (obj, spaces) => {
        const result = Object.keys(obj).map(key => `${' '.repeat(spaces * 2)}${key}: ${obj[key]}`).join('\n');
        return `\n${result}\n${' '.repeat((spaces * 2) - 2)}}`;
      };
      return `${property}: {${convertObjToString(value, l + 1)}`;
    },
  },
  {
    check: e => !(e instanceof Object),
    action: (property, value) => `${property}: ${value}`,
  },
];
const stringify = (property, value, l) => {
  const { action } = _.find(stringifyOptions, ({ check }) => check(value));
  return action(property, value, l);
};

const mappers = {
  nested: (element, l, func) => {
    const a = func(element.children, l + 1);
    return `${' '.repeat((l + 1) * 2)}${element.name}: {\n${a}\n${' '.repeat((l * 2) + 2)}}`;
  },
  added: (element, l) => `${' '.repeat(l * 2)}+ ${stringify(element.name, element.value, l + 1)}`,
  deleted: (element, l) => `${' '.repeat(l * 2)}- ${stringify(element.name, element.value, l + 1)}`,
  modified: (element, l) => [`${' '.repeat(l * 2)}- ${
    stringify(element.name, element.value.old, l + 1)}`, `${' '.repeat(l * 2)}+ ${stringify(element.name, element.value.new, l + 1)}`],
  unchanged: (element, l) => `${' '.repeat(l * 2)}  ${stringify(element.name, element.value, l)}`,
};

const renderElement = (ast, l) => {
  const display = (element) => {
    const func = mappers[element.type];
    return func(element, l, renderElement);
  };
  const output = ast.map(display);
  const flattened = _.flatten(output).join('\n');
  return flattened;
};
const getStandartRender = (ast, level = 2) => {
  const result = renderElement(ast, level);
  return `{\n${result}\n}\n`;
};
export default getStandartRender;
