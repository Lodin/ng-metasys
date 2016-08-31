import * as angular from 'angular';
import {NgmsReflect} from '../core';
import * as ExtensionBootstrapper from '../extensions/bootstrap';
import {bootstrapProvider} from './bootstrap-provider';

class Bootstrapper {
  public bootstrapInject = spyOn(ExtensionBootstrapper, 'bootstrapInject');
  public defineMetadata = spyOn(NgmsReflect, 'defineMetadata');

  public unarm(...toUnarm: string[]) {
    const hasAll = toUnarm.indexOf('all') !== -1;

    if (toUnarm.indexOf('inject') !== -1 || hasAll) {
      this.bootstrapInject.and.returnValue(null);
    }

    if (toUnarm.indexOf('meta') !== -1 || hasAll) {
      this.defineMetadata.and.returnValue(null);
    }
  }
}

describe('Function `bootstrapProvider`', () => {
  class TestProvider {
    public $get() {}
  }

  let ngModule: angular.IModule;
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    ngModule = angular.module('TestModule', []);
    bootstrapper = new Bootstrapper();
  });

  it('should create a provider', () => {
    bootstrapper.unarm('all');

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
    bootstrapper.unarm('meta');

    const metadata = ['$http', '$q'];

    bootstrapper.bootstrapInject.and.returnValue({
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

  it('should define a permanent metadata for a declaration', () => {
    bootstrapper.unarm('inject');

    bootstrapper.defineMetadata.and.callFake(
      (declaration: any, type: string, data: any) => {
        expect(declaration).toEqual(TestProvider);
        expect(type).toEqual('provider');
        expect(data).toEqual({
          name: 'TestProvider',
          instance: TestProvider
        });
      });

    bootstrapProvider(ngModule, TestProvider);

    expect(bootstrapper.defineMetadata).toHaveBeenCalled();
  });
});
