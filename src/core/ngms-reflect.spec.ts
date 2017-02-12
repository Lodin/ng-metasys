import {NgmsReflect} from './ngms-reflect';
import * as tokens from './tokens';

describe('Class `NgmsReflect`', () => {
  it('should get access to a module list', () => {
    expect(NgmsReflect.modules).toEqual(jasmine.any(Map));
  });

  it('should define permanent metadata for declaration', () => {
    class TestDeclaration {}

    const data = {name: 'TestDeclaration', instance: TestDeclaration};

    NgmsReflect.defineMetadata(TestDeclaration, tokens.permanent.service, data);

    expect(Reflect.getMetadata(tokens.permanent.service, TestDeclaration.prototype)).toEqual(data);
  });

  it('should get metadata for declaration', () => {
    class TestDeclaration {}

    const data = {name: 'TestDeclaration', instance: TestDeclaration};
    Reflect.defineMetadata(tokens.permanent.service, data, TestDeclaration.prototype);

    expect(NgmsReflect.getMetadata(TestDeclaration)).toEqual(data);
  });
});
