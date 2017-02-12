import * as angular from 'angular';
import * as tokens from '../core/tokens';
import {NgmsReflect} from '../core/ngms-reflect';
import * as bootstrapComponent from '../component/bootstrap-component';
import * as bootstrapDirective from '../directive/bootstrap-directive';
import * as bootstrapFilter from '../filter/bootstrap-filter';
import * as bootstrapProviders from '../providers/bootstrap-providers';
import * as bootstrapModuleConfig from './bootstrap-module-config';
import bootstrapModule from './bootstrap-module';

class Bootstrapper {
  public bootstrapComponent = spyOn(bootstrapComponent, 'default');
  public bootstrapDirective = spyOn(bootstrapDirective, 'default');
  public bootstrapFilter = spyOn(bootstrapFilter, 'default');
  public bootstrapProviders = spyOn(bootstrapProviders, 'default');
  public bootstrapModuleConfig = spyOn(bootstrapModuleConfig, 'default');

  constructor() {
    this.bootstrapComponent.and.returnValue(null);
    this.bootstrapDirective.and.returnValue(null);
    this.bootstrapFilter.and.returnValue(null);
    this.bootstrapProviders.and.returnValue(null);
  }

  public unarm() {
    this.bootstrapModuleConfig.and.returnValue(null);
  }
}

describe('Function `bootstrapModule`', () => {
  class TestModule {
    public static value = 1;
    public static constant = 3;

    public static config() {}
    public static run() {}
  }

  let bootstrapper: Bootstrapper;
  let fakeModule: angular.IModule;

  beforeEach(() => {
    bootstrapper = new Bootstrapper();
    fakeModule = angular.module('TestModule', []);
  });

  afterEach(() => {
    Reflect.deleteMetadata(tokens.module.self, TestModule.prototype);
    (<any> NgmsReflect)._modules = new Map();
  });

  it('should create bare module and write it to the `moduleList`', () => {
    Reflect.defineMetadata(tokens.module.self, {}, TestModule.prototype);

    bootstrapper.unarm();

    spyOn(angular, 'module').and.callFake(
      (name: string, dependencies: string[]): angular.IModule => {
        expect(name).toEqual('TestModule');
        expect(dependencies).toEqual([]);

        return fakeModule;
      });

    bootstrapModule(TestModule);

    expect(angular.module).toHaveBeenCalled();
    expect(NgmsReflect.modules.has('TestModule')).toBeTruthy();
  });

  it('should do nothing if module is already bootstrapped', () => {
    Reflect.defineMetadata(tokens.module.self, {}, TestModule.prototype);

    bootstrapper.unarm();

    spyOn(angular, 'module').and.returnValue(fakeModule);

    bootstrapModule(TestModule);
    bootstrapModule(TestModule);

    expect((<any> angular.module).calls.count()).toEqual(1);
  });

  it('should throw an error if module declaration does not have a @Module mark', () => {
    expect(() => {
      class TestModuleError {}
      bootstrapModule(TestModuleError);
    }).toThrow();
  });

  it('should import dependency modules', () => {
    class DependencyModule {}
    const fakeDependencyModule = angular.module('DependencyModule', []);

    const imports = ['localStorageModule', 'ui.router', DependencyModule];

    Reflect.defineMetadata(tokens.module.self, {imports}, TestModule.prototype);
    Reflect.defineMetadata(tokens.module.self, {}, DependencyModule.prototype);

    bootstrapper.unarm();

    spyOn(angular, 'module').and.callFake(
      (name: string, dependencies: string[]): angular.IModule => {
        if (name === 'DependencyModule') {
          return fakeDependencyModule;
        }

        expect(dependencies).toEqual(['localStorageModule', 'ui.router', 'DependencyModule']);
        return fakeModule;
      });

    bootstrapModule(TestModule);
  });

  it('should initialize declarations', () => {
    class TestComponent {
    }
    class TestDirective {
    }
    class TestFilter {
    }

    Reflect.defineMetadata(tokens.component, null, TestComponent.prototype);
    Reflect.defineMetadata(tokens.directive, null, TestDirective.prototype);
    Reflect.defineMetadata(tokens.filter, null, TestFilter.prototype);

    const declarations = [TestComponent, TestDirective, TestFilter];

    Reflect.defineMetadata(tokens.module.self, {declarations}, TestModule.prototype);

    bootstrapper.unarm();

    spyOn(angular, 'module').and.returnValue(fakeModule);

    bootstrapModule(TestModule);

    expect(bootstrapper.bootstrapComponent).toHaveBeenCalled();
    expect(bootstrapper.bootstrapDirective).toHaveBeenCalled();
    expect(bootstrapper.bootstrapFilter).toHaveBeenCalled();

    Reflect.deleteMetadata(tokens.component, TestComponent.prototype);
    Reflect.deleteMetadata(tokens.directive, TestDirective.prototype);
    Reflect.deleteMetadata(tokens.filter, TestFilter.prototype);
  });

  it('should throw an error if declaration does not have @Component, @Directive or @Filter mark',
    () => {
      class DeclarationWithoutMark {}
      const declarations = [DeclarationWithoutMark];

      Reflect.defineMetadata(tokens.module.self, {declarations}, TestModule.prototype);
      bootstrapper.unarm();

      spyOn(angular, 'module').and.returnValue(fakeModule);

      expect(() => bootstrapModule(TestModule)).toThrow();
    });

  it('should initialize providers', () => {
    class TestProvider {
    }

    Reflect.defineMetadata(tokens.providers.provider, null, TestProvider.prototype);

    const providers = [TestProvider];

    Reflect.defineMetadata(tokens.module.self, {providers}, TestModule.prototype);

    bootstrapper.unarm();

    spyOn(angular, 'module').and.returnValue(fakeModule);

    bootstrapModule(TestModule);

    expect(bootstrapper.bootstrapProviders).toHaveBeenCalled();

    Reflect.deleteMetadata(tokens.providers.provider, TestProvider.prototype);
  });

  describe('at module configuration', () => {
    const spyFn = (type: string) => {
      spyOn(fakeModule, type).and.callFake((fn: Function) => {
        expect(fn).toEqual((<any> TestModule)[type]);
      });
    };

    const spyValue = (type: string) => {
      spyOn(fakeModule, type).and.callFake((property: string, value: any) => {
        expect(property).toEqual(type);
        expect(value).toEqual((<any> TestModule)[type]);
      });
    };

    const testModuleConfig = (token: symbol, type: string) => {
      Reflect.defineMetadata(token, type, TestModule);

      bootstrapper.bootstrapModuleConfig.and.returnValue([type]);

      bootstrapModule(TestModule);

      expect((<any> fakeModule)[type]).toHaveBeenCalled();
      expect(bootstrapper.bootstrapModuleConfig).toHaveBeenCalled();
      expect(angular.module).toHaveBeenCalled();
    };

    beforeEach(() => {
      Reflect.defineMetadata(tokens.module.self, {}, TestModule.prototype);
      spyOn(angular, 'module').and.returnValue(fakeModule);
    });

    afterEach(() => {
      Reflect.deleteMetadata(tokens.module.self, TestModule.prototype);
    });

    it('should initialize `config`', () => {
      spyFn('config');
      testModuleConfig(tokens.module.config, 'config');
    });

    it('should initialize `run`', () => {
      spyFn('run');
      testModuleConfig(tokens.module.run, 'run');
    });

    it('should initialize `value`', () => {
      spyValue('value');
      testModuleConfig(tokens.module.value, 'value');
    });

    it('should initialize `constant`', () => {
      spyValue('constant');
      testModuleConfig(tokens.module.constant, 'constant');
    });
  });

  describe('at checking metadata for broken elements', () => {
    it('should check metadata imports', () => {
      Reflect.defineMetadata(tokens.module.self, {imports: [undefined]}, TestModule.prototype);

      expect(() => {
        bootstrapModule(TestModule);
      }).toThrowError('Module TestModule has broken import (one or more imports is undefined)');
    });

    it('should check metadata declarations', () => {
      Reflect.defineMetadata(tokens.module.self, {declarations: [undefined]}, TestModule.prototype);

      expect(() => {
        bootstrapModule(TestModule);
      }).toThrowError('Module TestModule has broken declaration (one or more declarations is ' +
        'undefined)');
    });

    it('should check metadata providers', () => {
      Reflect.defineMetadata(tokens.module.self, {providers: [undefined]}, TestModule.prototype);

      expect(() => {
        bootstrapModule(TestModule);
      }).toThrowError('Module TestModule has broken provider (one or more providers is undefined)');
    });
  });
});
