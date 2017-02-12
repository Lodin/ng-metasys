import * as tokens from '../core/tokens';
import Module from './module-decorator';
import {ModuleMetadata} from './module-metadata';

describe('Decorator `Module`', () => {
  it('should add a module metadata to a decorated declaration', () => {
    const metadata: ModuleMetadata = {
      imports: ['localStorageModule']
    };

    @Module(metadata)
    class TestModule {}

    expect(Reflect.getMetadata(tokens.module.self, TestModule.prototype)).toEqual(metadata);
  });
});
