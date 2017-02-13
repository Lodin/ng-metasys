import * as angular from 'angular';
import * as bootstrapModule from '../module/bootstrap-module';
import bootstrap from './bootstrap';

class Bootstrapper {
  public bootstrapInject = spyOn(bootstrapModule, 'default');
}

class Spy {
  public bootstrap = spyOn(angular, 'bootstrap');
}

describe('Function `bootstrap`', () => {
  class TestModule {
  }

  let testModule: angular.IModule;
  let bootstrapper: Bootstrapper;
  let spy: Spy;

  beforeEach(() => {
    testModule = angular.module('testModule', []);
    bootstrapper = new Bootstrapper();
    bootstrapper.bootstrapInject.and.returnValue(testModule);
    spy = new Spy();
  });

  it('should create angular module from metadata and bootstrap it in angular', () => {
    bootstrap(TestModule);

    expect(bootstrapper.bootstrapInject).toHaveBeenCalled();
    expect(angular.bootstrap).toHaveBeenCalledWith(document, [testModule]);
  });

  it('should receive a html element and bootstrap module to it', () => {
    bootstrap(TestModule, document.body);

    expect(bootstrapper.bootstrapInject).toHaveBeenCalled();
    expect(angular.bootstrap).toHaveBeenCalledWith(document.body, [testModule]);
  });
});
