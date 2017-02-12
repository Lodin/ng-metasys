import * as angular from 'angular';
import {NgmsReflect} from '../core/ngms-reflect';
import * as bootstrapInject from '../extensions/bootstrap-inject';
import bootstrapFilter from './bootstrap-filter';

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

describe('Function `bootstrapFilter`', () => {
  class TestFilter {
    public static execute() {}
  }

  let ngModule: angular.IModule;
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    ngModule = angular.module('TestModule', []);
    bootstrapper = new Bootstrapper();
  });

  it('should define metadata for decorated class', () => {
    bootstrapper.unarm('all');

    spyOn(ngModule, 'filter').and.callFake((name: string, execute: Function) => {
      expect(name).toEqual('test');
      expect(execute).toEqual(TestFilter.execute);
    });

    bootstrapFilter(ngModule, TestFilter);
  });

  it('should add injections to the `execute` function', () => {
    bootstrapper.unarm('meta');

    bootstrapper.bootstrapInject.and.returnValue({
      hasMethods: true,
      injectMethods: (declaration: any, methodName: string) => {
        declaration[methodName].$inject = ['$http', '$q'];
      }
    });

    spyOn(ngModule, 'filter').and.callFake((name: string, execute: Function) => {
      expect((execute as any).$inject).toEqual(['$http', '$q']);
    });

    bootstrapFilter(ngModule, TestFilter);
  });

  it('should define a permanent metadata for a declaration', () => {
    bootstrapper.unarm('inject');

    bootstrapper.defineMetadata.and.callFake(
      (declaration: any, type: string, data: any) => {
        expect(declaration).toEqual(TestFilter);
        expect(type).toEqual('filter');
        expect(data).toEqual({
          name: 'Test',
          instance: TestFilter.execute
        });
      });

    bootstrapFilter(ngModule, TestFilter);

    expect(bootstrapper.defineMetadata).toHaveBeenCalled();
  });
});
