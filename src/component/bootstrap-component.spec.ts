import * as angular from 'angular';
import * as tokens from '../core/tokens';
import {NgmsReflect} from '../core/ngms-reflect';
import * as bootstrapInject from '../extensions/bootstrap-inject';
import * as bootstrapBind from '../extensions/bootstrap-bind';
import * as bootstrapTransclude from '../extensions/bootstrap-transclude';
import bootstrapComponent from './bootstrap-component';
import {ComponentMetadata} from './component-metadata';

class Bootstrapper {
  public bootstrapInject = spyOn(bootstrapInject, 'default');
  public bootstrapBind = spyOn(bootstrapBind, 'default');
  public bootstrapTransclude = spyOn(bootstrapTransclude, 'default');
  public defineMetadata = spyOn(NgmsReflect, 'defineMetadata');

  public unarm(...toUnarm: string[]) {
    const hasAll = toUnarm.indexOf('all') !== -1;

    if (toUnarm.indexOf('inject') !== -1 || hasAll) {
      this.bootstrapInject.and.returnValue(null);
    }

    if (toUnarm.indexOf('bind') !== -1 || hasAll) {
      this.bootstrapBind.and.returnValue(null);
    }

    if (toUnarm.indexOf('transclude') !== -1 || hasAll) {
      this.bootstrapTransclude.and.returnValue(null);
    }

    if (toUnarm.indexOf('meta') !== -1 || hasAll) {
      this.defineMetadata.and.returnValue(null);
    }
  }
}

describe('Function `bootstrapComponent`', () => {
  class TestComponent {
  }
  class MockService {
  }

  const decorate = (metadata: ComponentMetadata) =>
    Reflect.defineMetadata(tokens.component, metadata, TestComponent.prototype);

  let ngModule: angular.IModule;
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    ngModule = angular.module('testModule', []);
    bootstrapper = new Bootstrapper();
  });

  afterEach(() => {
    Reflect.deleteMetadata(tokens.component, TestComponent.prototype);
  });

  it('should generate a component data fitting to the raw angular component metadata', () => {
    decorate({
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

    bootstrapper.unarm('all');

    bootstrapComponent(ngModule, TestComponent);

    expect(bootstrapper.bootstrapInject).toHaveBeenCalled();
    expect(bootstrapper.bootstrapBind).toHaveBeenCalled();
    expect(bootstrapper.bootstrapTransclude).toHaveBeenCalled();
  });

  it('should allow using `templateUrl` metadata', () => {
    decorate({
      selector: 'app-test',
      templateUrl: 'test.component.html'
    });

    spyOn(ngModule, 'component').and.callFake((name: string, data: angular.IComponentOptions) => {
      expect(data).toEqual({
        templateUrl: 'test.component.html',
        controller: TestComponent
      });
    });

    bootstrapper.unarm('all');

    bootstrapComponent(ngModule, TestComponent);
  });

  it('should allow using `controllerAs` metadata', () => {
    decorate({
      selector: 'app-test',
      controllerAs: 'vm'
    });

    spyOn(ngModule, 'component').and.callFake((name: string, data: angular.IComponentOptions) => {
      expect(data).toEqual(<angular.IComponentOptions> {
        controller: TestComponent,
        controllerAs: 'vm'
      });
    });

    bootstrapper.unarm('all');

    bootstrapComponent(ngModule, TestComponent);
  });

  it('should add common injections defined with @Inject to component data', () => {
    decorate({selector: 'app-test'});

    bootstrapper.bootstrapInject.and.returnValue({
      hasCommon: true,
      hasProperties: false,
      injectCommon: (declaration: any) => {
        declaration.$inject = ['$http', '$q'];
      }
    });

    bootstrapper.unarm('bind', 'transclude', 'meta');

    spyOn(ngModule, 'component').and.callFake((name: string, data: angular.IComponentOptions) => {
      expect(data).toEqual({
        controller: TestComponent
      });

      expect((<any> data.controller).$inject).toEqual(['$http', '$q']);
    });

    bootstrapComponent(ngModule, TestComponent);
  });

  it('should add properties marked with @Property to component data', () => {
    decorate({selector: 'app-test'});

    bootstrapper.bootstrapBind.and.returnValue({
      someObject: '<',
      someString: '@',
      someExpr: '&'
    });

    bootstrapper.unarm('inject', 'transclude', 'meta');

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
    decorate({selector: 'app-test'});

    bootstrapper.unarm('inject', 'bind', 'meta');
    bootstrapper.bootstrapTransclude.and.returnValue({slot: 'testSlot'});

    spyOn(ngModule, 'component').and.callFake((name: string, data: angular.IComponentOptions) => {
      expect(data).toEqual({
        controller: TestComponent,
        transclude: {slot: 'testSlot'}
      });
    });

    bootstrapComponent(ngModule, TestComponent);
  });

  it('should define a permanent metadata for a declaration', () => {
    const metadata = {
      selector: 'app-test',
      template: '<div></div>'
    };

    decorate(metadata);
    bootstrapper.unarm('inject', 'bind', 'transclude');

    bootstrapper.defineMetadata.and.callFake(
      (declaration: any, type: symbol, data: angular.IComponentOptions) => {
        expect(declaration).toEqual(TestComponent);
        expect(type).toEqual(tokens.permanent.component);
        expect(data).toEqual({
          name: 'appTest',
          template: '<div></div>',
          controller: TestComponent,
          controllerAs: '$ctrl'
        });
      });

    bootstrapComponent(ngModule, TestComponent);

    expect(bootstrapper.defineMetadata).toHaveBeenCalled();
  });
});
