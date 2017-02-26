import * as angular from 'angular';
import * as NgmsReflect from '../core/reflection';
import * as tokens from '../core/tokens';
import * as bootstrapInject from '../extensions/bootstrap-inject';
import bootstrapService from './bootstrap-service';
import Service from './service-decorator';

class Bootstrapper {
  public bootstrapInject = spyOn(bootstrapInject, 'default');
  public defineMetadata = spyOn(NgmsReflect, 'defineMetadata');

  public ngModule = {
    service: jasmine.createSpy('angular.IModule#service')
  };

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

describe('Function `bootstrapService`', () => {
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    bootstrapper = new Bootstrapper();
  });

  it('should create a service', () => {
    class TestService {
    }

    bootstrapper.unarm('all');

    bootstrapService(bootstrapper.ngModule as any, TestService);

    expect(bootstrapper.bootstrapInject).toHaveBeenCalled();
    expect(bootstrapper.ngModule.service).toHaveBeenCalledWith('TestService', TestService);
  });

  it('should add common injections to the service', () => {
    class TestService {
    }

    bootstrapper.unarm('meta');

    const metadata = ['$http', '$q'];

    bootstrapper.bootstrapInject.and.returnValue({
      hasCommon: true,
      injectCommon: (declaration: any) => {
        declaration.$inject = metadata;
      }
    });

    bootstrapService(bootstrapper.ngModule as any, TestService);

    expect((TestService as any).$inject).toEqual(metadata);
  });

  it('should define a permanent metadata for a declaration', () => {
    class TestService {
    }

    bootstrapper.unarm('inject');

    bootstrapService(bootstrapper.ngModule as any, TestService);

    expect(bootstrapper.defineMetadata).toHaveBeenCalledWith(
      TestService,
      tokens.permanent.service,
      {
        name: 'TestService',
        instance: TestService
      }
    );
  });
});

describe('Decorator `Service` and function `bootstrapService`', () => {
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    bootstrapper = new Bootstrapper();
  });

  it('should work together', () => {
    bootstrapper.unarm('all');

    @Service
    class TestService {
      public $get() {}
    }

    bootstrapService(bootstrapper.ngModule as any, TestService);

    expect(bootstrapper.ngModule.service).toHaveBeenCalledWith('TestService', TestService);
  });
});
