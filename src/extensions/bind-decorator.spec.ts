import Bind from './bind-decorator';

describe('Decorator `@Bind`', () => {
  it('should define property metadata for decorated declarations', () => {
    class TestDeclaration {
      @Bind('<') public obj: any;
      @Bind('&') public expr: any;
    }

    const metadata = Reflect.getMetadata('ngms:binding', TestDeclaration.prototype);
    expect(metadata).toEqual({
      obj: '<',
      expr: '&'
    });
  });
});
