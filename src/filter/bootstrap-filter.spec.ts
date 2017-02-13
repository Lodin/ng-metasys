import * as angular from 'angular';
import * as tokens from '../core/tokens';
import * as NgmsReflect from '../core/reflection';
import * as bootstrapInject from '../extensions/bootstrap-inject';
import bootstrapFilter from './bootstrap-filter';

class Bootstrapper {
  public bootstrapInject = spyOn(bootstrapInject, 'default');
  public defineMetadata = spyOn(NgmsReflect, 'defineMetadata');

  public unarm(...toUnarm: string[]) {
    const hasAll = toUnarm.indexOf('all') !== -1;

    if (toUnarm.indexOf('inject') !== -1 || hasAll) {
      this.bootstrapInject.and.returnValue(null);
    }

    if (toUnarm.indexOf('meta') !== -1 || hasAll) {
      this.defineMetadata.and.returnValue(null);
    }
  }
}

describe('Function `bootstrapFilter`', () => {
  let ngModule: any;
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    ngModule = {
      filter: jasmine.createSpy('angular.IModule#filter')
    };
    bootstrapper = new Bootstrapper();
  });

  it('should define metadata for decorated class', () => {
    class TestFilter {
      public static execute() {
      }
    }

    bootstrapper.unarm('all');

    bootstrapFilter(ngModule, TestFilter);

    expect(ngModule.filter).toHaveBeenCalledWith('test', TestFilter.execute);
  });

  it('should add injections to the `execute` function', () => {
    class TestFilter {
      public static execute() {
      }
    }

    bootstrapper.unarm('meta');

    bootstrapper.bootstrapInject.and.returnValue({
      hasMethods: true,
      injectMethods: (declaration: any, methodName: string) => {
        declaration[methodName].$inject = ['$http', '$q'];
      }
    });

    bootstrapFilter(ngModule, TestFilter);

    expect(TestFilter.execute.$inject).toEqual(['$http', '$q']);
  });

  it('should define a permanent metadata for a declaration', () => {
    class TestFilter {
      public static execute() {
      }
    }

    bootstrapper.unarm('inject');

    bootstrapFilter(ngModule, TestFilter);

    expect(bootstrapper.defineMetadata).toHaveBeenCalledWith(
      TestFilter,
      tokens.permanent.filter,
      {
        name: 'Test',
        instance: TestFilter.execute
      }
    );
  });
});
