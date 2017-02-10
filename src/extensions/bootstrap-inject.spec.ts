import * as angular from 'angular';
import {bootstrapInject} from './bootstrap-inject';

describe('Function `bootstrapInject`', () => {
  class MockInjectDeclaration {}
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

    injector.injectCommon(TestDeclaration);
    expect((<any> TestDeclaration).$inject).toEqual(['$http', 'MockInjectDeclaration']);
  });

  it('should create DeclarationInjector instance with method injections', () => {
    Reflect.defineMetadata('ngms:inject:method', {
      config: ['$http', MockInjectDeclaration]
    }, TestDeclaration);

    const injector = bootstrapInject(TestDeclaration);

    expect(injector.hasCommon).not.toBeTruthy();
    expect(injector.hasMethods).toBeTruthy();

    injector.injectMethods(TestDeclaration, 'config');

    expect((TestDeclaration.config as any).$inject).toEqual(['$http', 'MockInjectDeclaration']);
  });

  it('should create DeclarationInjector instance with constructor parameter injections', () => {
    Reflect.defineMetadata('ngms:inject:param', [
      '$http',
      MockInjectDeclaration
    ], TestDeclaration.prototype);

    const injector = bootstrapInject(TestDeclaration);
    expect(injector.hasCommon).toBeTruthy();
    expect(injector.hasMethods).not.toBeTruthy();

    injector.injectCommon(TestDeclaration);
    expect((TestDeclaration as any).$inject).toEqual(['$http', 'MockInjectDeclaration']);
  });
});
