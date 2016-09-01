import {providersDecoratorFactory} from './providers-decorator-factory';

describe('Function `providersDecoratorFactory`', () => {
  it('should define a provider metadata for decorated declaration', () => {
    const Provider = providersDecoratorFactory('provider');

    @Provider
    class TestProvider {
      public $get() {}
    }

    expect(Reflect.hasMetadata('ngms:providers:provider', TestProvider.prototype)).toBeTruthy();
  });
});
