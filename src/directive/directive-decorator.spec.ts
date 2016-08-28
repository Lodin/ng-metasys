import {Directive} from './directive-decorator';
import {DirectiveMetadata} from './directive-metadata';

describe('Decorator `@Directive`', () => {
  it('should add a directive metadata to a decorated class', () => {
    const metadata = {
      selector: '[test-attribute]',
      template: '<div></div>'
    };

    @Directive(metadata)
    class TestDirective {}

    const reflectedMeta = Reflect.getMetadata('ngms:directive', TestDirective.prototype);

    expect(reflectedMeta).toEqual(metadata);
  });

  it('should throw an error if selector is not set', () => {
    expect(() => {
      @Directive(<DirectiveMetadata> {})
      class TestDirective {}
    }).toThrow();
  });
});
