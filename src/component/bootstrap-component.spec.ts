import * as angular from 'angular';
import * as ExtensionBootstrapper from '../extensions/bootstrap';
import {bootstrapComponent} from './bootstrap-component';
import {ComponentMetadata} from './component-metadata';

describe('Function `bootstrapComponent`', () => {
  class TestComponent {}
  class MockService {}

  const decorateComponent = (metadata: ComponentMetadata) =>
    Reflect.defineMetadata('ngms:component', metadata, TestComponent.prototype);

  const unarmExtensionBootstrapper = () => {
    spyOn(ExtensionBootstrapper, 'bootstrapInject').and.returnValue(null);
    spyOn(ExtensionBootstrapper, 'bootstrapProperty').and.returnValue(null);
    spyOn(ExtensionBootstrapper, 'bootstrapTransclude').and.returnValue(null);
  };

  let ngModule: angular.IModule;

  beforeEach(() => {
    ngModule = angular.module('testModule', []);
  });

  afterEach(() => {
    Reflect.deleteMetadata('ngms:component', TestComponent.prototype);
  });

  it('should generate a component data fitting to the raw angular component metadata', () => {
    const metadata: ComponentMetadata = {
      selector: 'app-test',
      template: '<div class="container"></div>'
    };

    decorateComponent(metadata);

    spyOn(ngModule, 'component').and.callFake((name: string, data: angular.IComponentOptions) => {
      expect(name).toEqual('appTest');
      expect(data).toEqual({
        template: '<div class="container"></div>',
        controller: TestComponent
      });
    });

    unarmExtensionBootstrapper();

    bootstrapComponent(ngModule, TestComponent);

    expect(ExtensionBootstrapper.bootstrapInject).toHaveBeenCalled();
    expect(ExtensionBootstrapper.bootstrapProperty).toHaveBeenCalled();
    expect(ExtensionBootstrapper.bootstrapTransclude).toHaveBeenCalled();
  });

  it('should allow using `templateUrl` metadata', () => {
    const metadata: ComponentMetadata = {
      selector: 'app-test',
      templateUrl: 'test.component.html',
    };

    decorateComponent(metadata);

    spyOn(ngModule, 'component').and.callFake((name: string, data: angular.IComponentOptions) => {
      expect(data).toEqual(<angular.IComponentOptions> {
        templateUrl: 'test.component.html',
        controller: TestComponent,
      });
    });

    unarmExtensionBootstrapper();

    bootstrapComponent(ngModule, TestComponent);
  });

  it('should allow using `controllerAs` metadata', () => {
    const metadata: ComponentMetadata = {
      selector: 'app-test',
      controllerAs: 'vm'
    };

    decorateComponent(metadata);

    spyOn(ngModule, 'component').and.callFake((name: string, data: angular.IComponentOptions) => {
      expect(data).toEqual(<angular.IComponentOptions> {
        controller: TestComponent,
        controllerAs: 'vm'
      });
    });

    unarmExtensionBootstrapper();

    bootstrapComponent(ngModule, TestComponent);
  });

  it('should add common injections defined with @Inject to component data', () => {
    const metadata: ComponentMetadata = {selector: 'app-test'};
    decorateComponent(metadata);

    spyOn(ExtensionBootstrapper, 'bootstrapInject').and.returnValue({
      hasCommon: true,
      hasProperties: false,
      injectCommon: (declaration: any) => {
        declaration.$inject = ['$http', '$q'];
      },
    });
    spyOn(ExtensionBootstrapper, 'bootstrapProperty').and.returnValue(null);
    spyOn(ExtensionBootstrapper, 'bootstrapTransclude').and.returnValue(null);

    spyOn(ngModule, 'component').and.callFake((name: string, data: angular.IComponentOptions) => {
      expect(data).toEqual({
        controller: TestComponent
      });

      expect((<any> data.controller).$inject).toEqual(['$http', '$q']);
    });

    bootstrapComponent(ngModule, TestComponent);
  });

  it('should add property injections (properties marked with @Inject) to component data', () => {
    const metadata: ComponentMetadata = {selector: 'app-test'};
    decorateComponent(metadata);

    spyOn(ExtensionBootstrapper, 'bootstrapInject').and.returnValue({
      hasCommon: false,
      hasProperties: true,
      injectProperties: (declaration: any) => {
        const service = new MockService();
        Object.defineProperty(declaration, 'mockService', {get: () => service});
      }
    });
    spyOn(ExtensionBootstrapper, 'bootstrapProperty').and.returnValue(null);
    spyOn(ExtensionBootstrapper, 'bootstrapTransclude').and.returnValue(null);

    spyOn(ngModule, 'component').and.callFake((name: string, data: angular.IComponentOptions) => {
      expect(data).toEqual({
        controller: TestComponent
      });

      expect((<any> data.controller).mockService).toEqual(jasmine.any(MockService));
    });

    bootstrapComponent(ngModule, TestComponent);
  });

  it('should add properties marked with @Property to component data', () => {
    const metadata: ComponentMetadata = {selector: 'app-test'};
    decorateComponent(metadata);

    spyOn(ExtensionBootstrapper, 'bootstrapInject').and.returnValue(null);
    spyOn(ExtensionBootstrapper, 'bootstrapProperty').and.returnValue({
      someObject: '<',
      someString: '@',
      someExpr: '&'
    });
    spyOn(ExtensionBootstrapper, 'bootstrapTransclude').and.returnValue(null);

    spyOn(ngModule, 'component').and.callFake((name: string, data: angular.IComponentOptions) => {
      expect(data).toEqual({
        controller: TestComponent,
        bindings: {
          someObject: '<',
          someString: '@',
          someExpr: '&'
        },
      });
    });

    bootstrapComponent(ngModule, TestComponent);
  });

  it('should add transclude defined with @Transclude to component data ', () => {
    const metadata: ComponentMetadata = {selector: 'app-test'};
    decorateComponent(metadata);

    spyOn(ExtensionBootstrapper, 'bootstrapInject').and.returnValue(null);
    spyOn(ExtensionBootstrapper, 'bootstrapProperty').and.returnValue(null);
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
