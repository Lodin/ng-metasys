import * as NgmsReflect from '../core/reflection';
import * as tokens from '../core/tokens';
import * as bootstrapInject from '../extensions/bootstrap-inject';
import bootstrapProvider from './bootstrap-provider';
import Provider from './provider-decorator';

class Bootstrapper {
  public bootstrapInject = spyOn(bootstrapInject, 'default');
  public defineMetadata = spyOn(NgmsReflect, 'defineMetadata');

  public ngModule = {
    provider: jasmine.createSpy('angular.IModule#provider')
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

describe('Function `bootstrapProvider`', () => {
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    bootstrapper = new Bootstrapper();
  });

  it('should create a provider', () => {
    class TestProvider {
      public $get() {}
    }

    bootstrapper.unarm('all');

    bootstrapProvider(bootstrapper.ngModule as any, TestProvider);

    expect(bootstrapper.bootstrapInject).toHaveBeenCalled();
    expect(bootstrapper.ngModule.provider).toHaveBeenCalledWith('TestProvider', TestProvider);
  });

  it('should throw an error if declaration does not have method $get', () => {
    expect(() => {
      class TestProviderError {}
      bootstrapProvider(bootstrapper.ngModule as any, TestProviderError);
    }).toThrowError('Provider TestProviderError should have method "$get"');
  });

  it('should add injections to the provider $get method', () => {
    class TestProvider {
      public $get() {}
    }

    bootstrapper.unarm('meta');

    const metadata = ['$http', '$q'];

    bootstrapper.bootstrapInject.and.returnValue({
      hasMethods: true,
      injectMethods: (declaration: any, methodName: string) => {
        declaration[methodName].$inject = metadata;
      }
    });

    bootstrapProvider(bootstrapper.ngModule as any, TestProvider);

    expect((TestProvider.prototype.$get as any).$inject).toEqual(metadata);
  });

  it('should define a permanent metadata for a declaration', () => {
    class TestProvider {
      public $get() {}
    }

    bootstrapper.unarm('inject');

    bootstrapProvider(bootstrapper.ngModule as any, TestProvider);

    expect(bootstrapper.defineMetadata).toHaveBeenCalledWith(
      TestProvider,
      tokens.permanent.provider,
      {
        name: 'TestProvider',
        instance: TestProvider
      }
    );
  });
});

describe('Decorator `Provider` and function `bootstrapProvider`', () => {
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    bootstrapper = new Bootstrapper();
  });

  it('should work together', () => {
    bootstrapper.unarm('all');

    @Provider
    class TestProvider {
      public $get() {}
    }

    bootstrapProvider(bootstrapper.ngModule as any, TestProvider);

    expect(bootstrapper.ngModule.provider).toHaveBeenCalledWith('TestProvider', TestProvider);
  });
});
