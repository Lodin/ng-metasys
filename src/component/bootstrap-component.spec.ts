import * as angular from 'angular';
import * as ExtensionBootstrapper from '../extensions/bootstrap';
import {bootstrapComponent} from './bootstrap-component';
import {ComponentMetadata} from './component-metadata';

describe('Function `bootstrapComponent`', () => {
  class TestComponent {}
  class MockService {}

  const decorateComponent = (metadata: ComponentMetadata) =>
    Reflect.defineMetadata('ngms:component', metadata, TestComponent.prototype);

  const unarmBootstrappers = (...fnToUnarm: string[]) => {
    if (fnToUnarm.indexOf('inject') !== -1 || fnToUnarm.indexOf('all') !== -1) {
      spyOn(ExtensionBootstrapper, 'bootstrapInject').and.returnValue(null);
    }

    if (fnToUnarm.indexOf('property') !== -1 || fnToUnarm.indexOf('all') !== -1) {
      spyOn(ExtensionBootstrapper, 'bootstrapProperty').and.returnValue(null);
    }

    if (fnToUnarm.indexOf('transclude') !== -1 || fnToUnarm.indexOf('all') !== -1) {
      spyOn(ExtensionBootstrapper, 'bootstrapTransclude').and.returnValue(null);
    }
  };

  let ngModule: angular.IModule;

  beforeEach(() => {
    ngModule = angular.module('testModule', []);
  });

  afterEach(() => {
    Reflect.deleteMetadata('ngms:component', TestComponent.prototype);
  });

  it('should generate a component data fitting to the raw angular component metadata', () => {
    decorateComponent({
      selector: 'app-test',
      template: '<div></div>'
    });

    spyOn(ngModule, 'component').and.callFake((name: string, data: angular.IComponentOptions) => {
      expect(name).toEqual('appTest');
      expect(data).toEqual({
        template: '<div></div>',
        controller: TestComponent
      });
    });

    unarmBootstrappers('all');

    bootstrapComponent(ngModule, TestComponent);

    expect(ExtensionBootstrapper.bootstrapInject).toHaveBeenCalled();
    expect(ExtensionBootstrapper.bootstrapProperty).toHaveBeenCalled();
    expect(ExtensionBootstrapper.bootstrapTransclude).toHaveBeenCalled();
  });

  it('should allow using `templateUrl` metadata', () => {
    decorateComponent({
      selector: 'app-test',
      templateUrl: 'test.component.html'
    });

    spyOn(ngModule, 'component').and.callFake((name: string, data: angular.IComponentOptions) => {
      expect(data).toEqual({
        templateUrl: 'test.component.html',
        controller: TestComponent
      });
    });

    unarmBootstrappers('all');

    bootstrapComponent(ngModule, TestComponent);
  });

  it('should allow using `controllerAs` metadata', () => {
    decorateComponent({
      selector: 'app-test',
      controllerAs: 'vm'
    });

    spyOn(ngModule, 'component').and.callFake((name: string, data: angular.IComponentOptions) => {
      expect(data).toEqual(<angular.IComponentOptions> {
        controller: TestComponent,
        controllerAs: 'vm'
      });
    });

    unarmBootstrappers('all');

    bootstrapComponent(ngModule, TestComponent);
  });

  it('should add common injections defined with @Inject to component data', () => {
    decorateComponent({selector: 'app-test'});

    spyOn(ExtensionBootstrapper, 'bootstrapInject').and.returnValue({
      hasCommon: true,
      hasProperties: false,
      injectCommon: (declaration: any) => {
        declaration.$inject = ['$http', '$q'];
      }
    });

    unarmBootstrappers('property', 'transclude');

    spyOn(ngModule, 'component').and.callFake((name: string, data: angular.IComponentOptions) => {
      expect(data).toEqual({
        controller: TestComponent
      });

      expect((<any> data.controller).$inject).toEqual(['$http', '$q']);
    });

    bootstrapComponent(ngModule, TestComponent);
  });

  it('should add property injections (properties marked with @Inject) to component data', () => {
    decorateComponent({selector: 'app-test'});

    spyOn(ExtensionBootstrapper, 'bootstrapInject').and.returnValue({
      hasCommon: false,
      hasProperties: true,
      injectProperties: (declaration: any) => {
        const service = new MockService();
        Object.defineProperty(declaration, 'mockService', {get: () => service});
      }
    });

    unarmBootstrappers('property', 'transclude');

    spyOn(ngModule, 'component').and.callFake((name: string, data: angular.IComponentOptions) => {
      expect(data).toEqual({
        controller: TestComponent
      });

      expect((<any> data.controller).mockService).toEqual(jasmine.any(MockService));
    });

    bootstrapComponent(ngModule, TestComponent);
  });

  it('should add properties marked with @Property to component data', () => {
    decorateComponent({selector: 'app-test'});

    spyOn(ExtensionBootstrapper, 'bootstrapProperty').and.returnValue({
      someObject: '<',
      someString: '@',
      someExpr: '&'
    });

    unarmBootstrappers('inject', 'transclude');

    spyOn(ngModule, 'component').and.callFake((name: string, data: angular.IComponentOptions) => {
      expect(data).toEqual({
        controller: TestComponent,
        bindings: {
          someObject: '<',
          someString: '@',
          someExpr: '&'
        }
      });
    });

    bootstrapComponent(ngModule, TestComponent);
  });

  it('should add transclude defined with @Transclude to component data', () => {
    decorateComponent({selector: 'app-test'});

    unarmBootstrappers('inject', 'property');
    spyOn(ExtensionBootstrapper, 'bootstrapTransclude').and.returnValue({slot: 'testSlot'});

    spyOn(ngModule, 'component').and.callFake((name: string, data: angular.IComponentOptions) => {
      expect(data).toEqual({
        controller: TestComponent,
        transclude: {slot: 'testSlot'}
      });
    });

    bootstrapComponent(ngModule, TestComponent);
  });
});
