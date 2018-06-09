import _ from 'lodash';

const stringifyOptions = [
  {
    check: e => (e instanceof Object && !(e instanceof Array)),
    action: (property, value, l) => {
      const convertObjToString = (obj, spaces) => {
        const result = Object.keys(obj).map(key => `${key}: ${obj[key]}`).join('\n');
        return `\n${' '.repeat(spaces * 2)}${result}\n${' '.repeat((spaces * 2) - 2)}}`;
      };
      return `${property}: {${convertObjToString(value, l + 1)}`;
    },
  },
  {
    check: e => !(e instanceof Object),
    action: (property, value) => `${property}: ${value}`,
  },
];
const objectStringify = (property, value, l) => {
  const { action } = _.find(stringifyOptions, ({ check }) => check(value));
  return action(property, value, l);
};

const mappers = {
  nested: (element, l, func) => {
    const a = func(element.children, l + 1);
    return `${' '.repeat((l + 1) * 2)}${element.name}: {\n${a}\n${' '.repeat((l * 2) + 2)}}`;
  },
  added: (element, l) => `${' '.repeat(l * 2)}+ ${objectStringify(element.name, element.value, l + 1)}`,
  deleted: (element, l) => `${' '.repeat(l * 2)}- ${objectStringify(element.name, element.value, l + 1)}`,
  modified: (element, l) => `${' '.repeat(l * 2)}- ${
    objectStringify(element.name, element.value.beforeChange, l + 1)}\n${' '.repeat(l * 2)}+ ${
    objectStringify(element.name, element.value.afterChange, l + 1)}`,
  unchanged: (element, l) => `${' '.repeat(l * 2)}  ${objectStringify(element.name, element.value, l)}`,
};

const render = (ast, l = 2) => {
  const display = (element) => {
    const func = mappers[element.type];
    return func(element, l, render);
  };
  const output = ast.map(display);
  return output.join('\n');
};

export default render;
