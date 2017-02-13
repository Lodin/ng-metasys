import * as camelCase from 'camelcase';

const attributePattern = /\[(.+?)\]/;
const commentPattern = /\/\/(.+)|\/\*\s*(.+)\s*\*\//m;

type ParseSelector = (selector: string) => string[];
const parseSelector: ParseSelector =
  selector => {
    let name: string;
    let restrict: string;

    switch (true) {
      case attributePattern.test(selector):
        [, name] = attributePattern.exec(selector) as string[];
        restrict = 'A';
        break;
      case commentPattern.test(selector):
        const [, str1, str2] = commentPattern.exec(selector) as string[];
        name = str1 || str2;
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
  };

export {ParseSelector};
export default parseSelector;
