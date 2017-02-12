import Link from './link-decorator';

describe('Decorator `@Link`', () => {
  it('should add a link metadata to a decorated class', () => {
    class TestDirective {
      @Link
      public static link() {}
    }

    const metadata = Reflect.getMetadata('ngms:directive:link', TestDirective);
    expect(metadata).toEqual('link');
  });

  it('should throw an error if class element marked with @Link is not a method', () => {
    expect(() => {
      class TestDirective {
        @Link public property: string;
      }
    }).toThrow();
  });
});
