import fs from 'fs';
import genDiff from '../src';


test('plain JSON', () => {
  const expectedN1 = fs.readFileSync('./__tests__/__fixtures__/expected', 'utf8');
  const resultN1 = genDiff('./__tests__/__fixtures__/json/config1.json', './__tests__/__fixtures__/json/config2.json');
  expect(resultN1).toEqual(expectedN1);
});
test('plain YAML', () => {
  const expectedN1 = fs.readFileSync('./__tests__/__fixtures__/expected', 'utf8');
  const resultN1 = genDiff('./__tests__/__fixtures__/yaml/config1.yml', './__tests__/__fixtures__/yaml/config2.yml');
  expect(resultN1).toEqual(expectedN1);
});
