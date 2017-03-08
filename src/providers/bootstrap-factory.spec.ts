import * as angular from 'angular';
import * as NgmsReflect from '../core/reflection';
import * as tokens from '../core/tokens';
import * as bootstrapInject from '../extensions/bootstrap-inject';
import bootstrapFactory from './bootstrap-factory';
import Factory from './factory-decorator';

class Bootstrapper {
  public bootstrapInject = spyOn(bootstrapInject, 'default');
  public defineMetadata = spyOn(NgmsReflect, 'defineMetadata');

  public ngModule = {
    factory: jasmine.createSpy('angular.IModule#factory')
  };

  public unarm(...toUnarm: string[]) {
    const hasAll = toUnarm.includes('all');

    if (toUnarm.includes('inject') || hasAll) {
      this.bootstrapInject.and.returnValue(new bootstrapInject.DeclarationInjector({}));
    }

    if (toUnarm.includes('meta') || hasAll) {
      this.defineMetadata.and.returnValue(null);
    }
  }
}

describe('Function `bootstrapFactory`', () => {
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    bootstrapper = new Bootstrapper();
  });

  it('should create a factory', () => {
    class TestFactory {
      public static $get() {}
    }

    bootstrapper.unarm('all');

    bootstrapFactory(bootstrapper.ngModule as any, TestFactory);

    expect(bootstrapper.bootstrapInject).toHaveBeenCalled();
    expect(bootstrapper.ngModule.factory).toHaveBeenCalledWith('TestFactory', TestFactory.$get);
  });

  it('should throw an error if declaration does not have static method $get', () => {
    expect(() => {
      class TestFactoryError {}
      bootstrapFactory(bootstrapper.ngModule as any, TestFactoryError);
    }).toThrowError('Factory TestFactoryError should have static method "$get"');
  });

  it('should add injections to the factory $get method', () => {
    class TestFactory {
      public static $get() {}
    }

    bootstrapper.unarm('meta');

    const metadata = ['$http', '$q'];

    bootstrapper.bootstrapInject.and.returnValue({
      hasMethods: true,
      injectMethods: (declaration: any, methodName: string) => {
        declaration[methodName].$inject = metadata;
      }
    });

    bootstrapFactory(bootstrapper.ngModule as any, TestFactory);

    expect((TestFactory.$get as any).$inject).toEqual(metadata);
  });

  it('should define a permanent metadata for a declaration', () => {
    class TestFactory {
      public static $get() {}
    }

    bootstrapper.unarm('inject');

    bootstrapFactory(bootstrapper.ngModule as any, TestFactory);

    expect(bootstrapper.defineMetadata).toHaveBeenCalled();

    expect(bootstrapper.defineMetadata).toHaveBeenCalledWith(
      TestFactory,
      tokens.permanent.factory,
      {
        name: 'TestFactory',
        instance: TestFactory.$get
      }
    );
  });
});

describe('Decorator `Factory` and function `bootstrapFactory`', () => {
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    bootstrapper = new Bootstrapper();
  });

  it('should work together', () => {
    bootstrapper.unarm('all');

    @Factory
    class TestFactory {
      public static $get() {}
    }

    bootstrapFactory(bootstrapper.ngModule as any, TestFactory);

    expect(bootstrapper.ngModule.factory).toHaveBeenCalledWith('TestFactory', TestFactory.$get);
  });
});
