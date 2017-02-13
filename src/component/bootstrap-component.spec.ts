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

    if (toUnarm.includes('meta') || hasAll) {
      this.defineMetadata.and.returnValue(null);
    }
  }
}

class Spy {
  public ngModule = {
    component: jasmine.createSpy('angular.IModule#component')
  };
}

describe('Function `bootstrapComponent`', () => {
  class MockService {
  }

  type Decorate = (declaration: any, metadata: ComponentMetadata) => void;
  const decorate: Decorate =
    (declaration, metadata) =>
      Reflect.defineMetadata(tokens.component, metadata, declaration.prototype);

  type Clear = (declaration: any) => void;
  const clear: Clear =
    declaration =>
      Reflect.deleteMetadata(tokens.component, declaration.prototype);

  let spy: Spy;
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    spy = new Spy();
    bootstrapper = new Bootstrapper();
  });

  it('should generate a component data fitting to the raw angular component metadata', () => {
    class TestComponent {
    }

    decorate(TestComponent, {
      selector: 'app-test',
      template: '<div></div>'
    });

    bootstrapper.unarm('all');

    bootstrapComponent(spy.ngModule as any, TestComponent);

    expect(bootstrapper.bootstrapInject).toHaveBeenCalled();
    expect(bootstrapper.bootstrapBind).toHaveBeenCalled();
    expect(bootstrapper.bootstrapTransclude).toHaveBeenCalled();
    expect(spy.ngModule.component).toHaveBeenCalledWith('appTest', {
      template: '<div></div>',
      controller: TestComponent
    });

    clear(TestComponent);
  });

  it('should allow using `templateUrl` metadata', () => {
    class TestComponent {
    }

    decorate(TestComponent, {
      selector: 'app-test',
      templateUrl: 'test.component.html'
    });

    bootstrapper.unarm('all');

    bootstrapComponent(spy.ngModule as any, TestComponent);

    expect(spy.ngModule.component).toHaveBeenCalledWith('appTest', {
      templateUrl: 'test.component.html',
      controller: TestComponent
    });

    clear(TestComponent);
  });

  it('should allow using `controllerAs` metadata', () => {
    class TestComponent {
    }

    decorate(TestComponent, {
      selector: 'app-test',
      controllerAs: 'vm'
    });

    bootstrapper.unarm('all');

    bootstrapComponent(spy.ngModule as any, TestComponent);

    expect(spy.ngModule.component).toHaveBeenCalledWith('appTest', {
      controller: TestComponent,
      controllerAs: 'vm'
    });

    clear(TestComponent);
  });

  it('should add common injections defined with @Inject to component data', () => {
    class TestComponent {
    }

    decorate(TestComponent, {selector: 'app-test'});

    bootstrapper.bootstrapInject.and.returnValue({
      hasCommon: true,
      hasProperties: false,
      injectCommon: (declaration: any) => {
        declaration.$inject = ['$http', '$q'];
      }
    });

    bootstrapper.unarm('bind', 'transclude', 'meta');

    bootstrapComponent(spy.ngModule as any, TestComponent);

    expect(spy.ngModule.component).toHaveBeenCalledWith('appTest', {
      controller: TestComponent
    });

    expect(TestComponent.$inject).toEqual(['$http', '$q']);

    clear(TestComponent);
  });

  it('should add properties marked with @Property to component data', () => {
    class TestComponent {
    }

    decorate(TestComponent, {selector: 'app-test'});

    bootstrapper.bootstrapBind.and.returnValue({
      someObject: '<',
      someString: '@',
      someExpr: '&'
    });

    bootstrapper.unarm('inject', 'transclude', 'meta');

    bootstrapComponent(spy.ngModule as any, TestComponent);

    expect(spy.ngModule.component).toHaveBeenCalledWith('appTest', {
      controller: TestComponent,
      bindings: {
        someObject: '<',
        someString: '@',
        someExpr: '&'
      }
    });

    clear(TestComponent);
  });

  it('should add transclude defined with @Transclude to component data', () => {
    class TestComponent {
    }

    decorate(TestComponent, {selector: 'app-test'});

    bootstrapper.unarm('inject', 'bind', 'meta');
    bootstrapper.bootstrapTransclude.and.returnValue({slot: 'testSlot'});

    bootstrapComponent(spy.ngModule as any, TestComponent);

    expect(spy.ngModule.component).toHaveBeenCalledWith('appTest', {
      controller: TestComponent,
      transclude: {slot: 'testSlot'}
    });

    clear(TestComponent);
  });

  it('should define a permanent metadata for a declaration', () => {
    class TestComponent {
    }

    const metadata = {
      selector: 'app-test',
      template: '<div></div>'
    };

    decorate(TestComponent, metadata);
    bootstrapper.unarm('inject', 'bind', 'transclude');

    bootstrapComponent(spy.ngModule as any, TestComponent);

    expect(bootstrapper.defineMetadata).toHaveBeenCalledWith(
      TestComponent,
      tokens.permanent.component,
      {
        name: 'appTest',
        template: '<div></div>',
        controller: TestComponent,
        controllerAs: '$ctrl'
      }
    );

    clear(TestComponent);
  });
});
