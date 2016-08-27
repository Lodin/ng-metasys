import * as angular from 'angular';
import * as ExtensionBootstrapper from '../extensions/bootstrap';
import * as LinkBootstrapper from './bootstrap-link';
import {bootstrapDirective} from './bootstrap-directive';
import {DirectiveMetadata} from './directive-metadata';

describe('Function `bootstrapDirective`', () => {
  class TestDirective {
    public static link() {}
  }
  class MockService {}

  const decorateDirective = (metadata: DirectiveMetadata) =>
    Reflect.defineMetadata('ngms:directive', metadata, TestDirective.prototype);

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

    if (fnToUnarm.indexOf('link') !== -1 || fnToUnarm.indexOf('all') !== -1) {
      spyOn(LinkBootstrapper, 'bootstrapLink').and.returnValue(null);
    }
  };

  let ngModule: angular.IModule;

  beforeEach(() => {
    ngModule = angular.module('testModule', []);
  });

  afterEach(() => {
    Reflect.deleteMetadata('ngms:directive', TestDirective.prototype);
  });

  it('should generate a directive data fitting to the raw angular directive metadata', () => {
    decorateDirective({
      selector: '[test-attribute]',
      template: '<div></div>'
    });

    spyOn(ngModule, 'directive').and.callFake((name: string, data: angular.IDirectiveFactory) => {
      expect(name).toEqual('testAttribute');
      expect(data()).toEqual({
        restrict: 'A',
        template: '<div></div>',
        controller: TestDirective,
        controllerAs: '$ctrl',
        scope: true
      });
    });

    unarmBootstrappers('all');

    bootstrapDirective(ngModule, TestDirective);

    expect(ExtensionBootstrapper.bootstrapInject).toHaveBeenCalled();
    expect(ExtensionBootstrapper.bootstrapProperty).toHaveBeenCalled();
    expect(ExtensionBootstrapper.bootstrapTransclude).toHaveBeenCalled();
    expect(LinkBootstrapper.bootstrapLink).toHaveBeenCalled();
  });

  it('should allow using `templateUrl` metadata', () => {
    decorateDirective({
      selector: '[test-attribute]',
      templateUrl: 'test.component.html'
    });

    spyOn(ngModule, 'directive').and.callFake((name: string, data: angular.IDirectiveFactory) => {
      expect(data()).toEqual({
        restrict: 'A',
        templateUrl: 'test.component.html',
        controller: TestDirective,
        controllerAs: '$ctrl',
        scope: true
      });
    });

    unarmBootstrappers('all');

    bootstrapDirective(ngModule, TestDirective);
  });

  it('should allow using `controllerAs` metadata', () => {
    decorateDirective({
      selector: '[test-attribute]',
      controllerAs: 'vm'
    });

    spyOn(ngModule, 'directive').and.callFake((name: string, data: angular.IDirectiveFactory) => {
      expect(data()).toEqual({
        restrict: 'A',
        controller: TestDirective,
        controllerAs: 'vm',
        scope: true
      });
    });

    unarmBootstrappers('all');

    bootstrapDirective(ngModule, TestDirective);
  });

  it('should add common injections defined with @Inject to directive data', () => {
    decorateDirective({selector: '[test-attribute]'});

    spyOn(ExtensionBootstrapper, 'bootstrapInject').and.returnValue({
      hasCommon: true,
      hasProperties: false,
      injectCommon: (declaration: any) => {
        declaration.$inject = ['$http', '$q'];
      }
    });

    unarmBootstrappers('property', 'transclude', 'link');

    spyOn(ngModule, 'directive').and.callFake((name: string, data: angular.IDirectiveFactory) => {
      expect((<any> data().controller).$inject).toEqual(['$http', '$q']);
    });

    bootstrapDirective(ngModule, TestDirective);
  });

  it('should add property injections (properties marked with @Inject) to directive data', () => {
    decorateDirective({selector: '[test-attribute]'});

    spyOn(ExtensionBootstrapper, 'bootstrapInject').and.returnValue({
      hasCommon: false,
      hasProperties: true,
      injectProperties: (declaration: any) => {
        const service = new MockService();
        Object.defineProperty(declaration, 'mockService', {get: () => service});
      }
    });

    unarmBootstrappers('property', 'transclude', 'link');

    spyOn(ngModule, 'directive').and.callFake((name: string, data: angular.IDirectiveFactory) => {
      expect((<any> data().controller).mockService).toEqual(jasmine.any(MockService));
    });

    bootstrapDirective(ngModule, TestDirective);
  });

  it('should add properties marked with @Property to directive data', () => {
    decorateDirective({selector: '[test-attribute]'});

    spyOn(ExtensionBootstrapper, 'bootstrapProperty').and.returnValue({
      someObject: '=',
      someString: '@',
      someExpr: '&'
    });

    unarmBootstrappers('inject', 'transclude', 'link');

    spyOn(ngModule, 'component').and.callFake((name: string, data: angular.IDirectiveFactory) => {
      expect(data()).toEqual({
        restrict: 'A',
        controller: TestDirective,
        bindToController: {
          someObject: '=',
          someString: '@',
          someExpr: '&'
        },
        controllerAs: '$ctrl',
        scope: true
      });
    });

    bootstrapDirective(ngModule, TestDirective);
  });

  it('should add transclude defined with @Transclude to directive data', () => {
    decorateDirective({selector: '[test-attribute]'});

    unarmBootstrappers('inject', 'property', 'link');
    spyOn(ExtensionBootstrapper, 'bootstrapTransclude').and.returnValue({slot: 'testSlot'});

    spyOn(ngModule, 'component').and.callFake((name: string, data: angular.IDirectiveFactory) => {
      expect(data()).toEqual({
        restrict: 'A',
        controller: TestDirective,
        transclude: {slot: 'testSlot'},
        controllerAs: '$ctrl',
        scope: true
      });
    });

    bootstrapDirective(ngModule, TestDirective);
  });

  it('should add link function defined with @Link to directive data', () => {
    decorateDirective({selector: '[test-attribute]'});

    unarmBootstrappers('inject', 'property', 'transclude');
    spyOn(LinkBootstrapper, 'bootstrapLink').and.returnValue('link');

    spyOn(ngModule, 'component').and.callFake((name: string, data: angular.IDirectiveFactory) => {
      expect(data()).toEqual({
        restrict: 'A',
        controller: TestDirective,
        link: TestDirective.link,
        controllerAs: '$ctrl',
        scope: true
      });
    });

    bootstrapDirective(ngModule, TestDirective);
  });
});
