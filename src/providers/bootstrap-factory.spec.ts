import * as angular from 'angular';
import {NgmsReflect} from '../core';
import * as bootstrapInject from '../extensions/bootstrap-inject';
import bootstrapFactory from './bootstrap-factory';

class Bootstrapper {
  public bootstrapInject = spyOn(bootstrapInject, 'default');
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

describe('Function `bootstrapFactory`', () => {
  class TestFactory {
    public static $get() {}
  }

  let ngModule: angular.IModule;
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    ngModule = angular.module('TestModule', []);
    bootstrapper = new Bootstrapper();
  });

  it('should create a factory', () => {
    bootstrapper.unarm('all');

    spyOn(ngModule, 'factory').and.callFake((name: string, fn: Function) => {
      expect(name).toEqual('TestFactory');
      expect(fn).toEqual(TestFactory.$get);
    });

    bootstrapFactory(ngModule, TestFactory);

    expect(bootstrapper.bootstrapInject).toHaveBeenCalled();
    expect(ngModule.factory).toHaveBeenCalled();
  });

  it('should throw an error if declaration does not have static method $get', () => {
    expect(() => {
      class TestFactoryError {}
      bootstrapFactory(ngModule, TestFactoryError);
    }).toThrow();
  });

  it('should add injections to the factory $get method', () => {
    bootstrapper.unarm('meta');

    const metadata = ['$http', '$q'];

    bootstrapper.bootstrapInject.and.returnValue({
      hasMethods: true,
      injectMethods: (declaration: any, methodName: string) => {
        declaration[methodName].$inject = metadata;
      }
    });

    spyOn(ngModule, 'factory').and.callFake((name: string, fn: Function) => {
      expect((fn as any).$inject).toEqual(metadata);
    });

    bootstrapFactory(ngModule, TestFactory);
  });

  it('should define a permanent metadata for a declaration', () => {
    bootstrapper.unarm('inject');

    bootstrapper.defineMetadata.and.callFake(
      (declaration: any, type: string, data: any) => {
        expect(declaration).toEqual(TestFactory);
        expect(type).toEqual('factory');
        expect(data).toEqual({
          name: 'TestFactory',
          instance: TestFactory.$get
        });
      });

    bootstrapFactory(ngModule, TestFactory);

    expect(bootstrapper.defineMetadata).toHaveBeenCalled();
  });
});
