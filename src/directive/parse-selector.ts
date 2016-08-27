import camelCase = require('camel-case');

const attributePattern = /\[(.+?)\]/;
const commentPattern = /\/\/(.+)/;

export function parseSelector(selector: string): string[] {
  let name: string;
  let restrict: string;

  switch (true) {
    case attributePattern.test(selector):
      [, name] = attributePattern.exec(selector);
      restrict = 'A';
      break;
    case commentPattern.test(selector):
      [, name] = commentPattern.exec(selector);
      restrict = 'M';
      break;
    case selector.charAt(0) === '.':
      name = selector.slice(1);
      restrict = 'C';
      break;
    default:
      name = selector;
      restrict = 'E';
      break;
  }

  return [camelCase(name), restrict];
}
