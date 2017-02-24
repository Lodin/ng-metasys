import * as angular from 'angular';
import * as tokens from '../core/tokens';
import bootstrapInject from './bootstrap-inject';
import Inject from './inject-decorator';

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

describe('Decorator `Inject` and function `bootstrapInject`', () => {
  class MockInjectDeclaration {}

  it('should work together at common injection', () => {
    @Inject('$http', MockInjectDeclaration)
    class TestDeclaration {
    }

    const injector = bootstrapInject(TestDeclaration);
    injector.injectCommon(TestDeclaration);
    expect((TestDeclaration as any).$inject).toEqual(['$http', 'MockInjectDeclaration']);
  });

  it('should work together at method injection', () => {
    class TestDeclaration {
      @Inject('$http')
      public static config() {
      }

      @Inject(MockInjectDeclaration)
      public static run() {
      }
    }

    const injector = bootstrapInject(TestDeclaration);
    injector.injectMethods(TestDeclaration, 'config');
    injector.injectMethods(TestDeclaration, 'run');
    expect((TestDeclaration.config as any).$inject).toEqual(['$http']);
    expect((TestDeclaration.run as any).$inject).toEqual(['MockInjectDeclaration']);
  });

  it('should work together at parameter injection', () => {
    class TestDeclaration {
      public constructor(
        @Inject('$http') $http: any,
        @Inject(MockInjectDeclaration) mockInject: any
      ) {}
    }

    const injector = bootstrapInject(TestDeclaration);
    injector.injectCommon(TestDeclaration);
    expect((TestDeclaration as any).$inject).toEqual(['$http', 'MockInjectDeclaration']);
  });
});
