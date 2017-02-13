import * as tokens from '../core/tokens';
import Directive from './directive-decorator';
import {DirectiveMetadata} from './directive-metadata';

describe('Decorator `@Directive`', () => {
  it('should add a directive metadata to a decorated class', () => {
    const metadata = {
      selector: '[test-attribute]',
      template: '<div></div>'
    };

    @Directive(metadata)
    class TestDirective {}

    const reflectedMeta = Reflect.getMetadata(tokens.directive.self, TestDirective.prototype);

    expect(reflectedMeta).toEqual(metadata);
  });

  it('should throw an error if selector is not set', () => {
    expect(() => {
      @Directive({} as DirectiveMetadata)
      class TestDirective {}
    }).toThrow();
  });
});
