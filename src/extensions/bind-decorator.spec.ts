import * as tokens from '../core/tokens';
import Bind from './bind-decorator';

describe('Decorator `@Bind`', () => {
  it('should define property metadata for decorated declarations', () => {
    class TestDeclaration {
      @Bind('<') public obj: any;
      @Bind('&') public expr: any;
    }

    const metadata = Reflect.getMetadata(tokens.binding, TestDeclaration.prototype);
    expect(metadata).toEqual({
      obj: '<',
      expr: '&'
    });
  });
});
