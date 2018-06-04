import { has } from 'lodash';

export default (file1, file2) => {
  const configOne = JSON.parse(file1);
  const configTwo = JSON.parse(file2);
  const mapping = {
    add: (prop, old, updated) => [[`+ ${prop}`], updated[prop]],
    del: (prop, old) => [[`- ${prop}`], old[prop]],
    mod: (prop, old, updated) => [`- ${prop}`, `${old[prop]}`, `+ ${prop}`, `${updated[prop]}`],
    unchanged: (prop, old) => [[`${prop}`], old[prop]],
  };
  const addedProps = Object.keys(configTwo).filter(element => !has(configOne, element))
    .map(element => [element, 'add']);
  const deletedProps = Object.keys(configOne).filter(element => !has(configTwo, element))
    .map(element => [element, 'del']);
  const modifiedProps = Object.keys(configTwo).filter(element => has(configOne, element)
    && configTwo[element] !== configOne[element])
    .map(element => [element, 'mod']);
  const unchangedProps = Object.keys(configTwo).filter(element =>
    has(configOne, element) && configTwo[element] === configOne[element])
    .map(element => [element, 'unchanged']);
  const allProps = addedProps.concat(deletedProps, modifiedProps, unchangedProps);
  const output = {};
  const difference = allProps.reduce((acc, element) => {
    const [prop, propType] = element;
    const value = mapping[propType](prop, configOne, configTwo);
    return propType !== 'mod' ? { ...acc, [value[0]]: value[1] } : { ...acc, [value[0]]: value[1], [value[2]]: value[3] };
  }, output);
  return difference;
};
