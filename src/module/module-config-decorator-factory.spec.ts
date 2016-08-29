import {moduleConfigDecoratorFactory} from './module-config-decorator-factory';

const Config = moduleConfigDecoratorFactory('config');

describe('Function `moduleConfigDecoratorFactory`', () => {
  it('should add module config metadata to decorated declaration', () => {
    class TestModule {
      @Config
      public static config() {}

      @Config
      public static config2() {}
    }

    const metadata = Reflect.getMetadata('ngms:module:config', TestModule);
    expect(metadata).toEqual(['config', 'config2']);
  });

  it('should throw an error if method is not static', () => {
    expect(() => {
      class TestModule {
        @Config
        public config1() {}
      }
    }).toThrow();
  });
});
