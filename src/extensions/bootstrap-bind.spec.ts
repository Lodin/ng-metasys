import * as tokens from '../core/tokens';
import bootstrapBind from './bootstrap-bind';

describe('Function `bootstrapBind`', () => {
  class TestDeclaration {}

  it('should get the property metadata of decorated class', () => {
    const metadata = {$http: '$http'};

    Reflect.defineMetadata(tokens.binding, metadata, TestDeclaration.prototype);

    const data = bootstrapBind(TestDeclaration);

    expect(data).toEqual(metadata);
  });
});
