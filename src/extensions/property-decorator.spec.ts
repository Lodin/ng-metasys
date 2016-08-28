import {Property} from './property-decorator';

describe('Decorator `@Property`', () => {
  it('should define property metadata for decorated declarations', () => {
    class TestDeclaration {
      @Property('<') public obj: any;
      @Property('&') public expr: any;
    }

    const metadata = Reflect.getMetadata('ngms:property', TestDeclaration.prototype);
    expect(metadata).toEqual({
      obj: '<',
      expr: '&'
    });
  });
});
