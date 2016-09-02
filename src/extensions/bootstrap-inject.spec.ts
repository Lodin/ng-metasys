import * as angular from 'angular';
import {bootstrapInject} from './bootstrap-inject';

describe('Function `bootstrapInject`', () => {
  class MockInjectDeclaration {}
  class MockService {}
  class TestDeclaration {
    public static config() {}
  }

  let ngModule: angular.IModule;

  beforeEach(() => {
    ngModule = angular.module('TestModule', []);
  });

  afterEach(() => {
    Reflect.deleteMetadata('ngms:inject', TestDeclaration.prototype);
    Reflect.deleteMetadata('ngms:inject:method', TestDeclaration);
    Reflect.deleteMetadata('ngms:inject:property', TestDeclaration);
  });

  it('should create DeclarationInjector instance with common injections', () => {
    Reflect.defineMetadata('ngms:inject', [
      '$http',
      MockInjectDeclaration
    ], TestDeclaration.prototype);

    const injector = bootstrapInject(TestDeclaration);
    expect(injector.hasCommon).toBeTruthy();
    expect(injector.hasMethods).not.toBeTruthy();
    expect(injector.hasProperties).not.toBeTruthy();

    injector.injectCommon(TestDeclaration);
    expect(TestDeclaration.$inject).toEqual(['$http', 'MockInjectDeclaration']);
  });

  it('should create DeclarationInjector instance with method injections', () => {
    Reflect.defineMetadata('ngms:inject:method', {
      config: ['$http', MockInjectDeclaration]
    }, TestDeclaration);

    const injector = bootstrapInject(TestDeclaration);

    expect(injector.hasCommon).not.toBeTruthy();
    expect(injector.hasMethods).toBeTruthy();
    expect(injector.hasProperties).not.toBeTruthy();

    injector.injectMethods(TestDeclaration, 'config');

    expect(TestDeclaration.config.$inject).toEqual(['$http', 'MockInjectDeclaration']);
  });

  it('should create DeclarationInjector instance with property injections', () => {
    spyOn(ngModule, 'run').and.callFake(([, runFn]: any[]) => {
      runFn({get: () => new MockService()});
    });

    Reflect.defineMetadata('ngms:inject:property', {
      $http: '$http',
      mockInjectDeclaration: MockInjectDeclaration
    }, TestDeclaration.prototype);

    const injector = bootstrapInject(TestDeclaration);

    expect(injector.hasCommon).not.toBeTruthy();
    expect(injector.hasMethods).not.toBeTruthy();
    expect(injector.hasProperties).toBeTruthy();

    injector.injectProperties(TestDeclaration.prototype, ngModule);

    expect(Reflect.getMetadata('ngms:inject:property:get', TestDeclaration.prototype, '$http'))
      .toEqual(jasmine.any(MockService));
    expect(Reflect.getMetadata(
      'ngms:inject:property:get',
      TestDeclaration.prototype,
      'mockInjectDeclaration'
    ))
      .toEqual(jasmine.any(MockService));

    expect(ngModule.run).toHaveBeenCalled();
  });
});
