import bootstrapProperty from './bootstrap-property';

describe('Function `bootstrapProperty`', () => {
  class TestDeclaration {}

  it('should get the property metadata of decorated class', () => {
    const metadata = {$http: '$http'};

    Reflect.defineMetadata('ngms:property', metadata, TestDeclaration.prototype);

    const data = bootstrapProperty(TestDeclaration);

    expect(data).toEqual(metadata);
  });
});
