import * as angular from 'angular';
import * as bootstrapModule from '../module/bootstrap-module';
import bootstrap from './bootstrap';

class Bootstrapper {
  public bootstrapInject = spyOn(bootstrapModule, 'default');
}

describe('Function `bootstrap`', () => {
  class TestModule {
  }

  let testModule: angular.IModule;
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    testModule = angular.module('testModule', []);
    bootstrapper = new Bootstrapper();
    bootstrapper.bootstrapInject.and.returnValue(testModule);
  });

  it('should create angular module from metadata and bootstrap it in angular', () => {
    spyOn(angular, 'bootstrap').and.callFake(
      (element: Element|JQuery|Document, modules: angular.IModule[]) => {
        expect(element).toEqual(document);
        expect(modules).toEqual([testModule]);
      });

    bootstrap(TestModule);

    expect(bootstrapper.bootstrapInject).toHaveBeenCalled();
    expect(angular.bootstrap).toHaveBeenCalled();
  });

  it('should receive a html element and bootstrap module to it', () => {
    spyOn(angular, 'bootstrap').and.callFake((element: Element|JQuery|Document) => {
      expect(element).toEqual(document.body);
    });

    bootstrap(TestModule, document.body);
    expect(bootstrapper.bootstrapInject).toHaveBeenCalled();
  });
});
