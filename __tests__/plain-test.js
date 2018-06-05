import fs from 'fs';
import genDiff from '../src/plain';


test('Test N1', () => {
  const expectedN1 = JSON.parse(fs.readFileSync('./__tests__/__fixtures__/expected.json', 'utf8'));
  const resultN1 = genDiff('./__tests__/__fixtures__/config1.json', './__tests__/__fixtures__/config2.json');
  expect(resultN1).toEqual(expectedN1);
});
