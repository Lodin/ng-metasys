import bootstrapBind from './bootstrap-bind';

describe('Function `bootstrapBind`', () => {
  class TestDeclaration {}

  it('should get the property metadata of decorated class', () => {
    const metadata = {$http: '$http'};

    Reflect.defineMetadata('ngms:binding', metadata, TestDeclaration.prototype);

    const data = bootstrapBind(TestDeclaration);

    expect(data).toEqual(metadata);
  });
});
