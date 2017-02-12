import * as tokens from '../core/tokens';
import providersDecoratorFactory from './providers-decorator-factory';

describe('Function `providersDecoratorFactory`', () => {
  it('should define a provider metadata for decorated declaration', () => {
    const Provider = providersDecoratorFactory(tokens.providers.provider);

    @Provider
    class TestProvider {
      public $get() {}
    }

    expect(Reflect.hasMetadata(tokens.providers.provider, TestProvider.prototype)).toBeTruthy();
  });
});
