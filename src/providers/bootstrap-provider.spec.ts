import * as angular from 'angular';
import * as ExtensionBootstrapper from '../extensions/bootstrap';
import {bootstrapProvider} from './bootstrap-provider';

describe('Function `bootstrapProvider`', () => {
  class TestProvider {
    public $get() {}
  }

  let ngModule: angular.IModule;

  beforeEach(() => {
    ngModule = angular.module('TestModule', []);
  });

  it('should create a provider', () => {
    spyOn(ExtensionBootstrapper, 'bootstrapInject').and.returnValue(null);
    spyOn(ngModule, 'provider').and.callFake((name: string, declaration: any) => {
      expect(name).toEqual('TestProvider');
      expect(declaration).toEqual(TestProvider);
    });

    bootstrapProvider(ngModule, TestProvider);

    expect(ExtensionBootstrapper.bootstrapInject).toHaveBeenCalled();
    expect(ngModule.provider).toHaveBeenCalled();
  });

  it('should throw an error if declaration does not have method $get', () => {
    expect(() => {
      class TestProviderError {}
      bootstrapProvider(ngModule, TestProviderError);
    }).toThrow();
  });

  it('should add injections to the provider $get method', () => {
    const metadata = ['$http', '$q'];

    spyOn(ExtensionBootstrapper, 'bootstrapInject').and.returnValue({
      hasMethods: true,
      injectMethods: (declaration: any, methodName: string) => {
        declaration[methodName].$inject = metadata;
      }
    });

    spyOn(ngModule, 'provider').and.callFake((name: string, declaration: any) => {
      expect(declaration.prototype.$get.$inject).toEqual(metadata);
    });

    bootstrapProvider(ngModule, TestProvider);
  });
});
