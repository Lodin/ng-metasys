import * as angular from 'angular';
import * as NgmsReflect from '../core/reflection';
import * as tokens from '../core/tokens';
import * as bootstrapInject from '../extensions/bootstrap-inject';
import bootstrapProvider from './bootstrap-provider';

class Bootstrapper {
  public bootstrapInject = spyOn(bootstrapInject, 'default');
  public defineMetadata = spyOn(NgmsReflect, 'defineMetadata');

  public unarm(...toUnarm: string[]) {
    const hasAll = toUnarm.includes('all');

    if (toUnarm.includes('inject') || hasAll) {
      this.bootstrapInject.and.returnValue(null);
    }

    if (toUnarm.includes('meta') || hasAll) {
      this.defineMetadata.and.returnValue(null);
    }
  }
}

describe('Function `bootstrapProvider`', () => {
  let ngModule: any;
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    ngModule = {
      provider: jasmine.createSpy('angular.IModule#provider')
    };
    bootstrapper = new Bootstrapper();
  });

  it('should create a provider', () => {
    class TestProvider {
      public $get() {}
    }

    bootstrapper.unarm('all');

    bootstrapProvider(ngModule, TestProvider);

    expect(bootstrapper.bootstrapInject).toHaveBeenCalled();
    expect(ngModule.provider).toHaveBeenCalledWith('TestProvider', TestProvider);
  });

  it('should throw an error if declaration does not have method $get', () => {
    expect(() => {
      class TestProviderError {}
      bootstrapProvider(ngModule, TestProviderError);
    }).toThrow();
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

    bootstrapProvider(ngModule, TestProvider);

    expect((TestProvider.prototype.$get as any).$inject).toEqual(metadata);
  });

  it('should define a permanent metadata for a declaration', () => {
    class TestProvider {
      public $get() {}
    }

    bootstrapper.unarm('inject');

    bootstrapProvider(ngModule, TestProvider);

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
