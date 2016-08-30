import * as angular from 'angular';
import * as ExtensionBootstrapper from '../extensions/bootstrap';
import {bootstrapFactory} from './bootstrap-factory';

describe('Function `bootstrapFactory`', () => {
  class TestFactory {
    public static $get() {}
  }

  let ngModule: angular.IModule;

  beforeEach(() => {
    ngModule = angular.module('TestModule', []);
  });

  it('should create a factory', () => {
    spyOn(ExtensionBootstrapper, 'bootstrapInject').and.returnValue(null);
    spyOn(ngModule, 'factory').and.callFake((name: string, fn: Function) => {
      expect(name).toEqual('TestFactory');
      expect(fn).toEqual(TestFactory.$get);
    });

    bootstrapFactory(ngModule, TestFactory);

    expect(ExtensionBootstrapper.bootstrapInject).toHaveBeenCalled();
    expect(ngModule.factory).toHaveBeenCalled();
  });

  it('should throw an error if declaration does not have static method $get', () => {
    expect(() => {
      class TestFactoryError {}
      bootstrapFactory(ngModule, TestFactoryError);
    }).toThrow();
  });

  it('should add injections to the factory $get method', () => {
    const metadata = ['$http', '$q'];

    spyOn(ExtensionBootstrapper, 'bootstrapInject').and.returnValue({
      hasMethods: true,
      injectMethods: (declaration: any, methodName: string) => {
        declaration[methodName].$inject = metadata;
      }
    });

    spyOn(ngModule, 'factory').and.callFake((name: string, fn: Function) => {
      expect(fn.$inject).toEqual(metadata);
    });

    bootstrapFactory(ngModule, TestFactory);
  });
});
