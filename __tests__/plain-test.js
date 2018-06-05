import fs from 'fs';
import genDiff from '../src';


test('plain JSON', () => {
  const expectedJSON = fs.readFileSync('./__tests__/__fixtures__/expected', 'utf8');
  const resultJSON = genDiff('./__tests__/__fixtures__/json/config1.json', './__tests__/__fixtures__/json/config2.json');
  expect(resultJSON).toEqual(expectedJSON);
});
test('plain YAML', () => {
  const expectedYAML = fs.readFileSync('./__tests__/__fixtures__/expected', 'utf8');
  const resultYAML = genDiff('./__tests__/__fixtures__/yaml/config1.yml', './__tests__/__fixtures__/yaml/config2.yml');
  expect(resultYAML).toEqual(expectedYAML);
});
