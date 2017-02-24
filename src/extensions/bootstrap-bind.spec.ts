import * as tokens from '../core/tokens';
import Bind from './bind-decorator';
import bootstrapBind from './bootstrap-bind';

describe('Function `bootstrapBind`', () => {
  class TestDeclaration {}

  it('should get the property metadata of decorated class', () => {
    const metadata = {obj: '<'};

    Reflect.defineMetadata(tokens.binding, metadata, TestDeclaration.prototype);

    expect(bootstrapBind(TestDeclaration)).toEqual(metadata);
  });
});

describe('Decorator `Bind` and function `bootstrapBind`', () => {
  it('should work together', () => {
    class TestDeclaration {
      @Bind('<') public obj: any;
      @Bind('&') public expr: any;
    }

    expect(bootstrapBind(TestDeclaration)).toEqual({obj: '<', expr: '&'});
  });
});
