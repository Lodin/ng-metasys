import * as angular from 'angular';
import {NgmsReflect} from '../core';
import * as ExtensionBootstrapper from '../extensions/bootstrap';
import * as LinkBootstrapper from './bootstrap-link';
import {bootstrapDirective} from './bootstrap-directive';
import {DirectiveMetadata} from './directive-metadata';

class Bootstrapper {
  public bootstrapInject = spyOn(ExtensionBootstrapper, 'bootstrapInject');
  public bootstrapProperty = spyOn(ExtensionBootstrapper, 'bootstrapProperty');
  public bootstrapTransclude = spyOn(ExtensionBootstrapper, 'bootstrapTransclude');
  public bootstrapLink = spyOn(LinkBootstrapper, 'bootstrapLink');
  public defineMetadata = spyOn(NgmsReflect, 'defineMetadata');

  public unarm(...toUnarm: string[]) {
    const hasAll = toUnarm.indexOf('all') !== -1;

    if (toUnarm.indexOf('inject') !== -1 || hasAll) {
      this.bootstrapInject.and.returnValue(null);
    }

    if (toUnarm.indexOf('property') !== -1 || hasAll) {
      this.bootstrapProperty.and.returnValue(null);
    }

    if (toUnarm.indexOf('transclude') !== -1 || hasAll) {
      this.bootstrapTransclude.and.returnValue(null);
    }

    if (toUnarm.indexOf('link') !== -1 || hasAll) {
      this.bootstrapLink.and.returnValue(null);
    }

    if (toUnarm.indexOf('meta') !== -1 || hasAll) {
      this.defineMetadata.and.returnValue(null);
    }
  }
}

describe('Function `bootstrapDirective`', () => {
  class TestDirective {
    public static link() {}
  }
  class MockService {}

  const decorate = (metadata: DirectiveMetadata) =>
    Reflect.defineMetadata('ngms:directive', metadata, TestDirective.prototype);

  let ngModule: angular.IModule;
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    ngModule = angular.module('testModule', []);
    bootstrapper = new Bootstrapper();
  });

  afterEach(() => {
    Reflect.deleteMetadata('ngms:directive', TestDirective.prototype);
  });

  it('should generate a directive data fitting to the raw angular directive metadata', () => {
    decorate({
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

    bootstrapper.unarm('all');

    bootstrapDirective(ngModule, TestDirective);

    expect(ExtensionBootstrapper.bootstrapInject).toHaveBeenCalled();
    expect(ExtensionBootstrapper.bootstrapProperty).toHaveBeenCalled();
    expect(ExtensionBootstrapper.bootstrapTransclude).toHaveBeenCalled();
    expect(LinkBootstrapper.bootstrapLink).toHaveBeenCalled();
  });

  it('should allow using `templateUrl` metadata', () => {
    decorate({
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

    bootstrapper.unarm('all');

    bootstrapDirective(ngModule, TestDirective);
  });

  it('should allow using `controllerAs` metadata', () => {
    decorate({
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

    bootstrapper.unarm('all');

    bootstrapDirective(ngModule, TestDirective);
  });

  it('should add common injections defined with @Inject to directive data', () => {
    decorate({selector: '[test-attribute]'});

    bootstrapper.bootstrapInject.and.returnValue({
      hasCommon: true,
      hasProperties: false,
      injectCommon: (declaration: any) => {
        declaration.$inject = ['$http', '$q'];
      }
    });

    bootstrapper.unarm('property', 'transclude', 'link', 'meta');

    spyOn(ngModule, 'directive').and.callFake((name: string, data: angular.IDirectiveFactory) => {
      expect((<any> data().controller).$inject).toEqual(['$http', '$q']);
    });

    bootstrapDirective(ngModule, TestDirective);
  });

  it('should add properties marked with @Property to directive data', () => {
    decorate({selector: '[test-attribute]'});

    bootstrapper.bootstrapProperty.and.returnValue({
      someObject: '=',
      someString: '@',
      someExpr: '&'
    });

    bootstrapper.unarm('inject', 'transclude', 'link', 'meta');

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
    decorate({selector: '[test-attribute]'});

    bootstrapper.unarm('inject', 'property', 'link', 'meta');
    bootstrapper.bootstrapTransclude.and.returnValue({slot: 'testSlot'});

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
    decorate({selector: '[test-attribute]'});

    bootstrapper.unarm('inject', 'property', 'transclude');
    bootstrapper.bootstrapLink.and.returnValue('link');

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

    expect(bootstrapper.bootstrapLink).toHaveBeenCalled();
  });

  it('should define a permanent metadata for a declaration', () => {
    const metadata = {
      selector: '[test-attribute]',
      template: '<div></div>'
    };

    decorate(metadata);
    bootstrapper.unarm('inject', 'property', 'transclude');

    bootstrapper.defineMetadata.and.callFake(
      (declaration: any, type: string, data: angular.IDirective) => {
        expect(declaration).toEqual(TestDirective);
        expect(type).toEqual('directive');
        expect(data).toEqual({
          name: 'testAttribute',
          restrict: 'A',
          template: '<div></div>',
          controller: TestDirective,
          controllerAs: '$ctrl',
          scope: true
        });
      });

    bootstrapDirective(ngModule, TestDirective);

    expect(bootstrapper.defineMetadata).toHaveBeenCalled();
  });
});
