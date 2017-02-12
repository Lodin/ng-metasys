import * as tokens from '../core/tokens';
import * as bootstrapInject from '../extensions/bootstrap-inject';
import bootstrapModuleConfig from './bootstrap-module-config';

class Bootstrapper {
  public bootstrapInject = spyOn(bootstrapInject, 'default');

  public unarm(): void {
    this.bootstrapInject.and.returnValue(null);
  }
}

describe('Function `boostrapModuleConfig`', () => {
  class TestModule {
    public static config1() {}
    public static config2() {}
  }

  let bootstrapper: Bootstrapper;

  const metadata = ['config1', 'config2'];

  beforeEach(() => {
    Reflect.defineMetadata(tokens.module.config, metadata, TestModule);
    bootstrapper = new Bootstrapper();
  });

  it('should get the module config metadata of decorated declaration', () => {
    bootstrapper.unarm();
    expect(bootstrapModuleConfig(TestModule, tokens.module.config)).toEqual(metadata);
  });

  it('should add injections to config functions', () => {
    const injections = ['$http', '$q'];

    bootstrapper.bootstrapInject.and.returnValue({
      hasMethods: true,
      injectMethods: (declaration: any, methodName: string) => {
        declaration[methodName].$inject = injections;
      }
    });

    bootstrapModuleConfig(TestModule, tokens.module.config);
    expect((TestModule.config1 as any).$inject).toEqual(injections);
    expect((TestModule.config2 as any).$inject).toEqual(injections);
  });
});
