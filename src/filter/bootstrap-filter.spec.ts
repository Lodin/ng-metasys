import * as angular from 'angular';
import * as tokens from '../core/tokens';
import * as NgmsReflect from '../core/reflection';
import * as bootstrapInject from '../extensions/bootstrap-inject';
import bootstrapFilter from './bootstrap-filter';
import Filter from './filter-decorator';

class Bootstrapper {
  public bootstrapInject = spyOn(bootstrapInject, 'default');
  public defineMetadata = spyOn(NgmsReflect, 'defineMetadata');

  public ngModule = {
    filter: jasmine.createSpy('angular.IModule#filter')
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

describe('Function `bootstrapFilter`', () => {
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    bootstrapper = new Bootstrapper();
  });

  it('should define metadata for decorated class', () => {
    class TestFilter {
      public static execute() {
      }
    }

    bootstrapper.unarm('all');

    bootstrapFilter(bootstrapper.ngModule as any, TestFilter);

    expect(bootstrapper.ngModule.filter).toHaveBeenCalledWith('test', TestFilter.execute);
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

    bootstrapFilter(bootstrapper.ngModule as any, TestFilter);

    expect(TestFilter.execute.$inject).toEqual(['$http', '$q']);
  });

  it('should define a permanent metadata for a declaration', () => {
    class TestFilter {
      public static execute() {
      }
    }

    bootstrapper.unarm('inject');

    bootstrapFilter(bootstrapper.ngModule as any, TestFilter);

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

describe('Decorator `Filter` and function `bootstrapFilter`', () => {
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    bootstrapper = new Bootstrapper();
  });

  it('should work together', () => {
    bootstrapper.unarm('all');

    @Filter
    class TestFilter {
      public static execute() {
      }
    }

    bootstrapFilter(bootstrapper.ngModule as any, TestFilter);

    expect(bootstrapper.ngModule.filter).toHaveBeenCalledWith('test', TestFilter.execute);
  });
});
