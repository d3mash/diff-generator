import fs from 'fs';
import genDiff from '../src';


test('plain', () => {
  const expectedJSON = fs.readFileSync('./__tests__/__fixtures__/expected', 'utf8');
  const resultJSON = genDiff('./__tests__/__fixtures__/json/plain-old.json', './__tests__/__fixtures__/json/plain-new.json');
  expect(resultJSON).toEqual(expectedJSON);

  const expectedYAML = fs.readFileSync('./__tests__/__fixtures__/expected', 'utf8');
  const resultYAML = genDiff('./__tests__/__fixtures__/yaml/plain-old.yml', './__tests__/__fixtures__/yaml/plain-new.yml');
  expect(resultYAML).toEqual(expectedYAML);

  const expectedINI = fs.readFileSync('./__tests__/__fixtures__/expected', 'utf8');
  const resultINI = genDiff('./__tests__/__fixtures__/ini/plain-old.ini', './__tests__/__fixtures__/ini/plain-new.ini');
  expect(resultINI).toEqual(expectedINI);
});

test('nested', () => {
  const expectedJSON = fs.readFileSync('./__tests__/__fixtures__/expected-nested', 'utf8');
  const resultJSON = genDiff('./__tests__/__fixtures__/json/nested-old.json', './__tests__/__fixtures__/json/nested-new.json');
  expect(resultJSON).toEqual(expectedJSON);

  const expectedYAML = fs.readFileSync('./__tests__/__fixtures__/expected-nested', 'utf8');
  const resultYAML = genDiff('./__tests__/__fixtures__/yaml/nested-old.yml', './__tests__/__fixtures__/yaml/nested-new.yml');
  expect(resultYAML).toEqual(expectedYAML);

  const expectedINI = fs.readFileSync('./__tests__/__fixtures__/expected-nested-ini', 'utf8');
  const resultINI = genDiff('./__tests__/__fixtures__/ini/nested-old.ini', './__tests__/__fixtures__/ini/nested-new.ini');
  expect(resultINI).toEqual(expectedINI);
});

test('nested-format-plain', () => {
  const expectedJSON = fs.readFileSync('./__tests__/__fixtures__/expected-plain-nested', 'utf8');
  const resultJSON = genDiff('./__tests__/__fixtures__/json/nested-old.json', './__tests__/__fixtures__/json/nested-new.json', 'plain');
  expect(resultJSON).toEqual(expectedJSON);

  const expectedYAML = fs.readFileSync('./__tests__/__fixtures__/expected-plain-nested', 'utf8');
  const resultYAML = genDiff('./__tests__/__fixtures__/yaml/nested-old.yml', './__tests__/__fixtures__/yaml/nested-new.yml', 'plain');
  expect(resultYAML).toEqual(expectedYAML);

  const expectedINI = fs.readFileSync('./__tests__/__fixtures__/expected-plain-ini', 'utf8');
  const resultINI = genDiff('./__tests__/__fixtures__/ini/nested-old.ini', './__tests__/__fixtures__/ini/nested-new.ini', 'plain');
  expect(resultINI).toEqual(expectedINI);
});

test('nested-format-json', () => {
  const expectedJSON = fs.readFileSync('./__tests__/__fixtures__/expected-json-nested', 'utf8');
  const resultJSON = genDiff('./__tests__/__fixtures__/json/nested-old.json', './__tests__/__fixtures__/json/nested-new.json', 'json');
  expect(resultJSON).toEqual(expectedJSON);

  const expectedYAML = fs.readFileSync('./__tests__/__fixtures__/expected-json-nested', 'utf8');
  const resultYAML = genDiff('./__tests__/__fixtures__/yaml/nested-old.yml', './__tests__/__fixtures__/yaml/nested-new.yml', 'json');
  expect(resultYAML).toEqual(expectedYAML);
});
