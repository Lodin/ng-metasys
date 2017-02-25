import {
  modules,
  defineMetadata,
  getMetadata,
  getPluginMetadata,
  isComponent,
  isDirective,
  isFactory,
  isFilter, isProvider, isService
} from './reflection';
import * as tokens from './tokens';

describe('Map `modules`', () => {
  it('should get access to a module list', () => {
    expect(modules).toEqual(jasmine.any(Map));
  });
});

describe('Function `defineMetadata`', () => {
  it('should define permanent metadata for declaration', () => {
    class TestDeclaration {
    }

    const data = {name: 'TestDeclaration', instance: TestDeclaration};

    defineMetadata(TestDeclaration, tokens.permanent.service, data);

    expect(Reflect.getMetadata(tokens.permanent.service, TestDeclaration.prototype)).toEqual(data);
  });
});

describe('Function `getMetadata`', () => {
  it('should get metadata for declaration', () => {
    class TestDeclaration {
    }

    const data = {name: 'TestDeclaration', instance: TestDeclaration};
    Reflect.defineMetadata(tokens.permanent.service, data, TestDeclaration.prototype);

    expect(getMetadata(TestDeclaration)).toEqual(data);
  });

  it('should throw error if declaration does not belong to the "ng-metasys" system', () => {
    class TestDeclaration {
    }

    expect(() => getMetadata(TestDeclaration))
      .toThrowError('Declaration TestDeclaration have no specified metadata');
  });
});

describe('Function `getPluginMetadata`', () => {
  it('should get metadata saved by specified token', () => {
    class TestDeclaration {
    }
    const testToken = Symbol();

    Reflect.defineMetadata(testToken, {name: 'Test'}, TestDeclaration.prototype);

    expect(getPluginMetadata(testToken, TestDeclaration)).toEqual({name: 'Test'});
  });

  it('should throw an error if metadata is not exist', () => {
    class TestDeclaration {
    }
    const testToken = Symbol();

    expect(() => getPluginMetadata(testToken, TestDeclaration))
      .toThrowError('Declaration TestDeclaration have no specified metadata');
  });
});

type MatcherTester = (type: string, token: symbol, matcher: Function) => void;
const matcherTester: MatcherTester =
  (type, token, matcher) => {
    describe(`Matcher \`is${type.charAt(0).toUpperCase() + type.slice(1)}\``, () => {
      it(`should detect if the declaration is ${type}`, () => {
        class TestDeclaration {
        }
        class AnotherDeclaration {
        }

        Reflect.defineMetadata(token, {}, TestDeclaration.prototype);

        expect(matcher(TestDeclaration)).toBeTruthy();
        expect(matcher(AnotherDeclaration)).not.toBeTruthy();
      });
    });
  };

matcherTester('component', tokens.component, isComponent);
matcherTester('directive', tokens.directive.self, isDirective);
matcherTester('factory', tokens.providers.factory, isFactory);
matcherTester('filter', tokens.filter, isFilter);
matcherTester('provider', tokens.providers.provider, isProvider);
matcherTester('service', tokens.providers.service, isService);
