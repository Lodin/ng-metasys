import * as tokens from '../core/tokens';
import Filter from './filter-decorator';

describe('Decorator `@Filter`', () => {
  it('should define filter metadata for a decorated declaration', () => {
    @Filter
    class TestFilter {
      public static execute() {}
    }

    expect(Reflect.hasMetadata(tokens.filter, TestFilter.prototype)).toBeTruthy();
  });

  it('should throw an error if declaration does not have an static `execute` method', () => {
    expect(() => {
      @Filter
      class TestFilter {}
    }).toThrow();
  });

  it('should throw an error if the name of filter does not end with `Filter`', () => {
    expect(() => {
      @Filter
      class TestFilterError {
        public static execute() {}
      }
    }).toThrow();
  });
});
