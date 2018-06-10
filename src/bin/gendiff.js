#!/usr/bin/env node
import program from 'commander';
import genDiff from '..';

program
  .version('0.1.0')
  .arguments('<firstConfig>, <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'default')
  .action((firstConfig, secondConfig, options) =>
    console.log(genDiff(firstConfig, secondConfig, options.format)));
program.parse(process.argv);

export default program;
