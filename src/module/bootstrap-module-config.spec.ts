import * as ExtensionBootstrapper from '../extensions/bootstrap';
import {bootstrapModuleConfig} from './bootstrap-module-config';

describe('Function `boostrapModuleConfig`', () => {
  class TestModule {
    public static config1() {}
    public static config2() {}
  }

  const metadata = ['config1', 'config2'];

  const unarmInject = () => spyOn(ExtensionBootstrapper, 'bootstrapInject').and.returnValue(null);

  beforeEach(() => {
    Reflect.defineMetadata('ngms:module:config', metadata, TestModule);
  });

  it('should get the module config metadata of decorated declaration', () => {
    unarmInject();
    expect(bootstrapModuleConfig(TestModule, 'config')).toEqual(metadata);
  });

  it('should add injections to config functions', () => {
    const injections = ['$http', '$q'];

    spyOn(ExtensionBootstrapper, 'bootstrapInject').and.returnValue({
      hasMethods: true,
      injectMethods: (declaration: any, methodName: string) => {
        declaration[methodName].$inject = injections;
      }
    });

    bootstrapModuleConfig(TestModule, 'config');
    expect(TestModule.config1.$inject).toEqual(injections);
    expect(TestModule.config2.$inject).toEqual(injections);
  });
});
