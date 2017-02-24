import * as angular from 'angular';
import * as NgmsReflect from '../core/reflection';
import * as tokens from '../core/tokens';
import * as bootstrapInject from '../extensions/bootstrap-inject';
import * as bootstrapBind from '../extensions/bootstrap-bind';
import * as bootstrapTransclude from '../extensions/bootstrap-transclude';
import * as bootstrapLink from './bootstrap-link';
import bootstrapDirective from './bootstrap-directive';
import Directive from './directive-decorator';
import {DirectiveMetadata} from './directive-metadata';

class Bootstrapper {
  public bootstrapInject = spyOn(bootstrapInject, 'default');
  public bootstrapBind = spyOn(bootstrapBind, 'default');
  public bootstrapTransclude = spyOn(bootstrapTransclude, 'default');
  public bootstrapLink = spyOn(bootstrapLink, 'default');
  public defineMetadata = spyOn(NgmsReflect, 'defineMetadata');

  public unarm(...toUnarm: string[]) {
    const hasAll = toUnarm.includes('all');

    if (toUnarm.includes('inject') || hasAll) {
      this.bootstrapInject.and.returnValue(null);
    }

    if (toUnarm.includes('bind') || hasAll) {
      this.bootstrapBind.and.returnValue(null);
    }

    if (toUnarm.includes('transclude') || hasAll) {
      this.bootstrapTransclude.and.returnValue(null);
    }

    if (toUnarm.includes('link') || hasAll) {
      this.bootstrapLink.and.returnValue(null);
    }

    if (toUnarm.includes('meta') || hasAll) {
      this.defineMetadata.and.returnValue(null);
    }
  }
}

describe('Function `bootstrapDirective`', () => {
  class MockService {
  }

  type Decorate = (declaration: any, metadata: DirectiveMetadata) => void;
  const decorate: Decorate =
    (declaration, metadata) =>
      Reflect.defineMetadata(tokens.directive.self, metadata, declaration.prototype);

  type Clear = (declaration: any) => void;
  const clear: Clear =
    declaration =>
      Reflect.deleteMetadata(tokens.directive.self, declaration.prototype);

  let ngModule: any;
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    ngModule = {
      directive: jasmine.createSpy('angular.IModule#directive')
    };
    bootstrapper = new Bootstrapper();
  });

  it('should generate a directive data fitting to the raw angular directive metadata', () => {
    class TestDirective {
    }

    decorate(TestDirective, {
      selector: '[test-attribute]',
      template: '<div></div>'
    });

    bootstrapper.unarm('all');

    bootstrapDirective(ngModule, TestDirective);

    expect(bootstrapper.bootstrapInject).toHaveBeenCalled();
    expect(bootstrapper.bootstrapBind).toHaveBeenCalled();
    expect(bootstrapper.bootstrapTransclude).toHaveBeenCalled();
    expect(bootstrapper.bootstrapLink).toHaveBeenCalled();
    expect(ngModule.directive).toHaveBeenCalledWith('testAttribute', jasmine.any(Function));

    const callback = ngModule.directive.calls.argsFor(0)[1];

    expect(callback()).toEqual({
      restrict: 'A',
      template: '<div></div>',
      controller: TestDirective,
      controllerAs: '$ctrl',
      scope: true
    });

    clear(TestDirective);
  });

  it('should allow using `templateUrl` metadata', () => {
    class TestDirective {
    }

    decorate(TestDirective, {
      selector: '[test-attribute]',
      templateUrl: 'test.component.html'
    });

    bootstrapper.unarm('all');

    bootstrapDirective(ngModule, TestDirective);

    expect(ngModule.directive).toHaveBeenCalledWith('testAttribute', jasmine.any(Function));

    const callback = ngModule.directive.calls.argsFor(0)[1];

    expect(callback()).toEqual({
      restrict: 'A',
      templateUrl: 'test.component.html',
      controller: TestDirective,
      controllerAs: '$ctrl',
      scope: true
    });

    clear(TestDirective);
  });

  it('should allow using `controllerAs` metadata', () => {
    class TestDirective {
    }

    decorate(TestDirective, {
      selector: '[test-attribute]',
      controllerAs: 'vm'
    });

    bootstrapper.unarm('all');

    bootstrapDirective(ngModule, TestDirective);

    expect(ngModule.directive).toHaveBeenCalledWith('testAttribute', jasmine.any(Function));

    const callback = ngModule.directive.calls.argsFor(0)[1];

    expect(callback()).toEqual({
      restrict: 'A',
      controller: TestDirective,
      controllerAs: 'vm',
      scope: true
    });

    clear(TestDirective);
  });

  it('should add common injections defined with @Inject to directive data', () => {
    class TestDirective {
    }

    decorate(TestDirective, {selector: '[test-attribute]'});

    bootstrapper.bootstrapInject.and.returnValue({
      hasCommon: true,
      hasProperties: false,
      injectCommon: (declaration: any) => {
        declaration.$inject = ['$http', '$q'];
      }
    });

    bootstrapper.unarm('bind', 'transclude', 'link', 'meta');

    bootstrapDirective(ngModule, TestDirective);

    expect(ngModule.directive).toHaveBeenCalledWith('testAttribute', jasmine.any(Function));

    expect(TestDirective.$inject).toEqual(['$http', '$q']);

    clear(TestDirective);
  });

  it('should add properties marked with @Property to directive data', () => {
    class TestDirective {
    }

    decorate(TestDirective, {selector: '[test-attribute]'});

    bootstrapper.bootstrapBind.and.returnValue({
      someObject: '=',
      someString: '@',
      someExpr: '&'
    });

    bootstrapper.unarm('inject', 'transclude', 'link', 'meta');

    bootstrapDirective(ngModule, TestDirective);

    expect(ngModule.directive).toHaveBeenCalledWith('testAttribute', jasmine.any(Function));

    const callback = ngModule.directive.calls.argsFor(0)[1];

    expect(callback()).toEqual({
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

    clear(TestDirective);
  });

  it('should add transclude defined with @Transclude to directive data', () => {
    class TestDirective {
    }

    decorate(TestDirective, {selector: '[test-attribute]'});

    bootstrapper.unarm('inject', 'bind', 'link', 'meta');
    bootstrapper.bootstrapTransclude.and.returnValue({slot: 'testSlot'});

    bootstrapDirective(ngModule, TestDirective);

    expect(ngModule.directive).toHaveBeenCalledWith('testAttribute', jasmine.any(Function));

    const callback = ngModule.directive.calls.argsFor(0)[1];

    expect(callback()).toEqual({
      restrict: 'A',
      controller: TestDirective,
      transclude: {slot: 'testSlot'},
      controllerAs: '$ctrl',
      scope: true
    });

    clear(TestDirective);
  });

  it('should add link function defined with @Link to directive data', () => {
    class TestDirective {
      public static link() {
      }
    }

    decorate(TestDirective, {selector: '[test-attribute]'});

    bootstrapper.unarm('inject', 'bind', 'transclude');
    bootstrapper.bootstrapLink.and.returnValue('link');

    bootstrapDirective(ngModule, TestDirective);

    expect(bootstrapper.bootstrapLink).toHaveBeenCalled();
    expect(ngModule.directive).toHaveBeenCalledWith('testAttribute', jasmine.any(Function));

    const callback = ngModule.directive.calls.argsFor(0)[1];

    expect(callback()).toEqual({
      restrict: 'A',
      controller: TestDirective,
      link: TestDirective.link,
      controllerAs: '$ctrl',
      scope: true
    });

    clear(TestDirective);
  });

  it('should define a permanent metadata for a declaration', () => {
    class TestDirective {
    }

    const metadata = {
      selector: '[test-attribute]',
      template: '<div></div>'
    };

    decorate(TestDirective, metadata);
    bootstrapper.unarm('inject', 'bind', 'transclude');

    bootstrapDirective(ngModule, TestDirective);

    expect(bootstrapper.defineMetadata).toHaveBeenCalledWith(
      TestDirective,
      tokens.permanent.directive,
      {
        name: 'testAttribute',
        restrict: 'A',
        template: '<div></div>',
        controller: TestDirective,
        controllerAs: '$ctrl',
        scope: true
      }
    );

    clear(TestDirective);
  });
});

describe('Decorator `Directive` and function `bootstrapDirective`', () => {
  let ngModule: any;
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    ngModule = {
      directive: jasmine.createSpy('angular.IModule#directive')
    };
    bootstrapper = new Bootstrapper();
  });

  it('should work together', () => {
    bootstrapper.unarm('all');

    @Directive({
      selector: '[test-attribute]',
      template: '<div></div>'
    })
    class TestDirective {}

    bootstrapDirective(ngModule, TestDirective);
    expect(ngModule.directive).toHaveBeenCalledWith('testAttribute', jasmine.any(Function));

    const callback = ngModule.directive.calls.argsFor(0)[1];

    expect(callback()).toEqual({
      restrict: 'A',
      template: '<div></div>',
      controller: TestDirective,
      controllerAs: '$ctrl',
      scope: true
    });
  });
});
