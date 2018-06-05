import fs from 'fs';
import genDiff from '../src/plain';


test('plain JSON', () => {
  const expectedN1 = JSON.parse(fs.readFileSync('./__tests__/__fixtures__/join/expected.json', 'utf8'));
  const resultN1 = genDiff('./__tests__/__fixtures__/json/config1.json', './__tests__/__fixtures__/json/config2.json');
  expect(resultN1).toEqual(expectedN1);
});
test('plain YAML', () => {
  const expectedN1 = JSON.parse(fs.readFileSync('./__tests__/__fixtures__/expected.json', 'utf8'));
  const resultN1 = genDiff('./__tests__/__fixtures__/config1.json', './__tests__/__fixtures__/config2.json');
  expect(resultN1).toEqual(expectedN1);
});
