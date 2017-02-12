import parseSelector from './parse-selector';

describe('Function `parseSelector`', () => {
  it('should parse attribute selector', () => {
    expect(parseSelector('[test-attribute]')).toEqual(['testAttribute', 'A']);
  });

  it('should parse class selector', () => {
    expect(parseSelector('.test-class')).toEqual(['testClass', 'C']);
  });

  it('should parse comment selector', () => {
    expect(parseSelector('//test-comment')).toEqual(['testComment', 'M']);
  });

  it('should parse everything else as a element selector', () => {
    expect(parseSelector('test-element')).toEqual(['testElement', 'E']);
  });
});
