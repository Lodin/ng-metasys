import * as angular from 'angular';
import * as ModuleBootstrapper from '../module/bootstrap';
import {bootstrap} from './bootstrap';

describe('bootstrap function', () => {
  class SomeModule {
  }

  let testModule: angular.IModule;

  beforeEach(() => {
    testModule = angular.module('testModule', []);
  });

  it('should create angular module from metadata and bootstrap it in angular', () => {
    spyOn(ModuleBootstrapper, 'bootstrapModule').and.returnValue(testModule);
    spyOn(angular, 'bootstrap').and.callFake(
      (element: Element|JQuery|Document, modules: angular.IModule[]) => {
        expect(element).toEqual(document);
        expect(modules).toEqual([testModule]);
      });

    bootstrap(SomeModule);

    expect(ModuleBootstrapper.bootstrapModule).toHaveBeenCalled();
    expect(angular.bootstrap).toHaveBeenCalled();
  });
});
