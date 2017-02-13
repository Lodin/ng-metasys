import {modules, defineMetadata, getMetadata} from './reflection';
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
    class TestDeclaration {}

    const data = {name: 'TestDeclaration', instance: TestDeclaration};
    Reflect.defineMetadata(tokens.permanent.service, data, TestDeclaration.prototype);

    expect(getMetadata(TestDeclaration)).toEqual(data);
  });
});
