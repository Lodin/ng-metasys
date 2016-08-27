import {bootstrapLink} from './bootstrap-link';

describe('Function `bootstrapLink`', () => {
  class TestDirective {}

  it('should get a link metadata from a directive declaration', () => {
    Reflect.defineMetadata('ngms:directive:link', 'link', TestDirective);

    expect(bootstrapLink(TestDirective)).toEqual('link');
  });
});
