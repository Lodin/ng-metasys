import * as angular from 'angular';
import {NgmsReflect} from '../core';
import * as ComponentBootstrapper from '../component/bootstrap';
import * as DirectiveBootstrapper from '../directive/bootstrap';
import * as FilterBootstrapper from '../filter/bootstrap';
import * as ProviderBootstrapper from '../providers/bootstrap';
import * as ModuleConfigBootstrapper from './bootstrap-module-config';
import {bootstrapModule} from './bootstrap-module';

class Bootstrapper {
  public bootstrapComponent = spyOn(ComponentBootstrapper, 'bootstrapComponent');
  public bootstrapDirective = spyOn(DirectiveBootstrapper, 'bootstrapDirective');
  public bootstrapFilter = spyOn(FilterBootstrapper, 'bootstrapFilter');
  public bootstrapProviders = spyOn(ProviderBootstrapper, 'bootstrapProviders');
  public bootstrapModuleConfig = spyOn(ModuleConfigBootstrapper, 'bootstrapModuleConfig');

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

    public static config() {
    }

    public static run() {
    }
  }

  let bootstrapper: Bootstrapper;
  let fakeModule: angular.IModule;

  beforeEach(() => {
    bootstrapper = new Bootstrapper();
    fakeModule = angular.module('TestModule', []);
  });

  afterEach(() => {
    Reflect.deleteMetadata('ngms:module', TestModule.prototype);
  });

  it('should create bare module and write it to the `moduleList`', () => {
    Reflect.defineMetadata('ngms:module', {}, TestModule.prototype);

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

    Reflect.defineMetadata('ngms:module', {imports}, TestModule.prototype);
    Reflect.defineMetadata('ngms:module', {}, DependencyModule.prototype);

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

    Reflect.defineMetadata('ngms:component', null, TestComponent.prototype);
    Reflect.defineMetadata('ngms:directive', null, TestDirective.prototype);
    Reflect.defineMetadata('ngms:filter', null, TestFilter.prototype);

    const declarations = [TestComponent, TestDirective, TestFilter];

    Reflect.defineMetadata('ngms:module', {declarations}, TestModule.prototype);

    bootstrapper.unarm();

    spyOn(angular, 'module').and.returnValue(fakeModule);

    bootstrapModule(TestModule);

    expect(bootstrapper.bootstrapComponent).toHaveBeenCalled();
    expect(bootstrapper.bootstrapDirective).toHaveBeenCalled();
    expect(bootstrapper.bootstrapFilter).toHaveBeenCalled();

    Reflect.deleteMetadata('ngms:component', TestComponent.prototype);
    Reflect.deleteMetadata('ngms:directive', TestDirective.prototype);
    Reflect.deleteMetadata('ngms:filter', TestFilter.prototype);
  });

  it('should throw an error if declaration does not have @Component, @Directive or @Filter mark',
    () => {
      class DeclarationWithoutMark {}
      const declarations = [DeclarationWithoutMark];

      Reflect.defineMetadata('ngms:module', {declarations}, TestModule.prototype);
      bootstrapper.unarm();

      spyOn(angular, 'module').and.returnValue(fakeModule);

      expect(() => bootstrapModule(TestModule)).toThrow();
    });

  it('should initialize providers', () => {
    class TestProvider {
    }

    Reflect.defineMetadata('ngms:provider', null, TestProvider.prototype);

    const providers = [TestProvider];

    Reflect.defineMetadata('ngms:module', {providers}, TestModule.prototype);

    bootstrapper.unarm();

    spyOn(angular, 'module').and.returnValue(fakeModule);

    bootstrapModule(TestModule);

    expect(bootstrapper.bootstrapProviders).toHaveBeenCalled();

    Reflect.deleteMetadata('ngms:provider', TestProvider.prototype);
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

    const testModuleConfig = (type: string) => {
      Reflect.defineMetadata(`ngms:module:${type}`, type, TestModule);

      bootstrapper.bootstrapModuleConfig.and.returnValue([type]);

      bootstrapModule(TestModule);

      expect((<any> fakeModule)[type]).toHaveBeenCalled();
      expect(bootstrapper.bootstrapModuleConfig).toHaveBeenCalled();
      expect(angular.module).toHaveBeenCalled();
    };

    beforeEach(() => {
      Reflect.defineMetadata('ngms:module', {}, TestModule.prototype);
      spyOn(angular, 'module').and.returnValue(fakeModule);
    });

    afterEach(() => {
      Reflect.deleteMetadata('ngms:module', TestModule.prototype);
    });

    it('should initialize `config`', () => {
      spyFn('config');
      testModuleConfig('config');
    });

    it('should initialize `run`', () => {
      spyFn('run');
      testModuleConfig('run');
    });

    it('should initialize `value`', () => {
      spyValue('value');
      testModuleConfig('value');
    });

    it('should initialize `constant`', () => {
      spyValue('constant');
      testModuleConfig('constant');
    });
  });
});
