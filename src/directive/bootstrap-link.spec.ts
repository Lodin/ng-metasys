import * as tokens from '../core/tokens';
import bootstrapLink from './bootstrap-link';

describe('Function `bootstrapLink`', () => {
  class TestDirective {}

  it('should get a link metadata from a directive declaration', () => {
    Reflect.defineMetadata(tokens.directive.link, 'link', TestDirective);

    expect(bootstrapLink(TestDirective)).toEqual('link');
  });
});
