import * as tokens from '../core/tokens';
import bootstrapLink from './bootstrap-link';
import Link from './link-decorator';

describe('Function `bootstrapLink`', () => {
  class TestDirective {}

  it('should get a link metadata from a directive declaration', () => {
    Reflect.defineMetadata(tokens.directive.link, 'link', TestDirective);

    expect(bootstrapLink(TestDirective)).toEqual('link');
  });
});

describe('Decorator `Link` and function `bootstrapLink`', () => {
  it('should work together', () => {
    class TestDirective {
      @Link
      public static link() {}
    }

    expect(bootstrapLink(TestDirective)).toEqual('link');
  });
});
