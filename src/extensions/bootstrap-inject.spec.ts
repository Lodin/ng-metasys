import * as angular from 'angular';
import * as tokens from '../core/tokens';
import bootstrapInject from './bootstrap-inject';

describe('Function `bootstrapInject`', () => {
  class MockInjectDeclaration {}

  type Clear = (declaration: any) => void;
  const clear: Clear =
    declaration => {
      Reflect.deleteMetadata(tokens.inject.self, declaration.prototype);
      Reflect.deleteMetadata(tokens.inject.method, declaration);
      Reflect.deleteMetadata(tokens.inject.param, declaration);
    };

  let ngModule: angular.IModule;

  beforeEach(() => {
    ngModule = angular.module('TestModule', []);
  });

  it('should create DeclarationInjector instance with common injections', () => {
    class TestDeclaration {
      public static config() {}
    }

    Reflect.defineMetadata(tokens.inject.self, [
      '$http',
      MockInjectDeclaration
    ], TestDeclaration.prototype);

    const injector = bootstrapInject(TestDeclaration);
    expect(injector.hasCommon).toBeTruthy();
    expect(injector.hasMethods).not.toBeTruthy();

    injector.injectCommon(TestDeclaration);
    expect((TestDeclaration as any).$inject).toEqual(['$http', 'MockInjectDeclaration']);

    clear(TestDeclaration);
  });

  it('should create DeclarationInjector instance with method injections', () => {
    class TestDeclaration {
      public static config() {}
    }

    Reflect.defineMetadata(tokens.inject.method, {
      config: ['$http', MockInjectDeclaration]
    }, TestDeclaration);

    const injector = bootstrapInject(TestDeclaration);

    expect(injector.hasCommon).not.toBeTruthy();
    expect(injector.hasMethods).toBeTruthy();

    injector.injectMethods(TestDeclaration, 'config');

    expect((TestDeclaration.config as any).$inject).toEqual(['$http', 'MockInjectDeclaration']);

    clear(TestDeclaration);
  });

  it('should create DeclarationInjector instance with constructor parameter injections', () => {
    class TestDeclaration {
      public static config() {}
    }

    Reflect.defineMetadata(tokens.inject.param, [
      '$http',
      MockInjectDeclaration
    ], TestDeclaration.prototype);

    const injector = bootstrapInject(TestDeclaration);
    expect(injector.hasCommon).toBeTruthy();
    expect(injector.hasMethods).not.toBeTruthy();

    injector.injectCommon(TestDeclaration);
    expect((TestDeclaration as any).$inject).toEqual(['$http', 'MockInjectDeclaration']);

    clear(TestDeclaration);
  });

  describe('should set $inject property to empty array', () => {
    it('if there is no methods', () => {
      class TestDeclaration {
        public static config() {}
      }

      const injector = bootstrapInject(TestDeclaration);
      expect(injector.hasMethods).not.toBeTruthy();

      injector.injectMethods(TestDeclaration, 'config');
      expect((TestDeclaration.config as any).$inject).toEqual([]);

      clear(TestDeclaration);
    });

    it('if there is no methods', () => {
      class TestDeclaration {
        public static config() {}
      }

      const injector = bootstrapInject(TestDeclaration);
      expect(injector.hasCommon).not.toBeTruthy();

      injector.injectCommon(TestDeclaration);

      expect((TestDeclaration as any).$inject).toEqual([]);

      clear(TestDeclaration);
    });
  });
});
