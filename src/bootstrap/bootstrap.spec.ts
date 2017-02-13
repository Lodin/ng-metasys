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
  let ngBootstrap: jasmine.Spy;

  beforeEach(() => {
    testModule = angular.module('testModule', []);
    bootstrapper = new Bootstrapper();
    bootstrapper.bootstrapInject.and.returnValue(testModule);
    ngBootstrap = spyOn(angular, 'bootstrap');
  });

  it('should create angular module from metadata and bootstrap it in angular', () => {
    bootstrap(TestModule);

    expect(bootstrapper.bootstrapInject).toHaveBeenCalled();
    expect(ngBootstrap).toHaveBeenCalledWith(document, [testModule]);
  });

  it('should receive a html element and bootstrap module to it', () => {
    bootstrap(TestModule, document.body);

    expect(bootstrapper.bootstrapInject).toHaveBeenCalled();
    expect(ngBootstrap).toHaveBeenCalledWith(document.body, [testModule]);
  });
});
