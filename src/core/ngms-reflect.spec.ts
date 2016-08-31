import {NgmsReflect} from './ngms-reflect';

describe('Class `NgmsReflect`', () => {
  it('should get access to a module list', () => {
    expect(NgmsReflect.modules).toEqual(jasmine.any(Map));
  });

  it('should define permanent metadata for declaration', () => {
    class TestDeclaration {}

    const data = {name: 'TestDeclaration', instance: TestDeclaration};

    NgmsReflect.defineMetadata(TestDeclaration, 'service', data);

    expect(Reflect.getMetadata('ngms:permanent:service', TestDeclaration.prototype)).toEqual(data);
  });

  it('should get metadata for declaration', () => {
    class TestDeclaration {}

    const data = {name: 'TestDeclaration', instance: TestDeclaration};
    Reflect.defineMetadata('ngms:permanent:service', data, TestDeclaration.prototype);

    expect(NgmsReflect.getMetadata(TestDeclaration)).toEqual(data);
  });
});
