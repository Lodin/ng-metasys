import * as tokens from '../core/tokens';
import Inject from './inject-decorator';

describe('Decorator `@Inject`', () => {
  class MockInject {
  }

  it('should inject data to the whole class (common injection)', () => {
    @Inject('$http', MockInject)
    class TestDeclaration {
    }

    const metadata = Reflect.getMetadata(tokens.inject.self, TestDeclaration.prototype);
    expect(metadata).toEqual(['$http', MockInject]);
  });

  it('should inject data to the methods of declaration (method injection)', () => {
    class TestDeclaration {
      @Inject('$http')
      public static config() {
      }

      @Inject(MockInject)
      public static run() {
      }
    }

    const metadata = Reflect.getMetadata(tokens.inject.method, TestDeclaration);
    expect(metadata).toEqual({config: ['$http'], run: [MockInject]});
  });

  it('should throw an error if method to inject is not static', () => {
    expect(() => {
      class TestDeclaration {
        @Inject('$http')
        public run() {
        }
      }
    }).toThrow();
  });

  it('should inject data to the constructor parameters', () => {
    class TestDeclaration {
      public constructor(@Inject('$http') $http: any, @Inject(MockInject) mockInject: any) {
      }
    }

    const metadata = Reflect.getMetadata(tokens.inject.param, TestDeclaration.prototype);
    expect(metadata).toEqual({0: '$http', 1: MockInject, length: 2});
  });

  it('should throw an error if there are more than one token while injecting to the constructor ' +
    'parameter', () => {
    expect(() => {
      class TestDeclaration {
        public constructor(@Inject('$http', MockInject) public $http: any) {
        }
      }
    }).toThrow();
  });
});
