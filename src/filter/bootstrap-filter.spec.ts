import * as angular from 'angular';
import * as ExtensionBootstrapper from '../extensions/bootstrap';
import {bootstrapFilter} from './bootstrap-filter';

describe('Function `bootstrapFilter`', () => {
  class TestFilter {
    public static execute() {}
  }

  const unarmInject = () => {
    spyOn(ExtensionBootstrapper, 'bootstrapInject').and.returnValue(null);
  };

  let ngModule: angular.IModule;

  beforeEach(() => {
    ngModule = angular.module('TestModule', []);
  });

  it('should define metadata for decorated class', () => {
    unarmInject();

    spyOn(ngModule, 'filter').and.callFake((name: string, execute: Function) => {
      expect(name).toEqual('test');
      expect(execute).toEqual(TestFilter.execute);
    });

    bootstrapFilter(ngModule, TestFilter);
  });

  it('should add injections to the `execute` function', () => {
    spyOn(ExtensionBootstrapper, 'bootstrapInject').and.returnValue({
      hasMethods: true,
      injectMethods: (declaration: any, methodName: string) => {
        declaration[methodName].$inject = ['$http', '$q'];
      }
    });

    spyOn(ngModule, 'filter').and.callFake((name: string, execute: Function) => {
      expect(execute.$inject).toEqual(['$http', '$q']);
    });

    bootstrapFilter(ngModule, TestFilter);
  });
});
