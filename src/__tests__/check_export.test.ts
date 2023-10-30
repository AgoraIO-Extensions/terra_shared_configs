import path from 'path';

describe('Check parsers/renderers export', () => {
  let indexPath: string = '';
  let requiredIndex: any = null;

  beforeEach(() => {
    indexPath = path.resolve(path.join(__dirname, '../index.ts'));
    requiredIndex = require(indexPath);
  });
  it('check export IrisDocRenderer', () => {
    let func = requiredIndex['IrisDocRenderer'];
    expect(func).toBeDefined();
  });
});
