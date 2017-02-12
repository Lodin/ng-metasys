import * as tokens from '../core/tokens';
import bootstrapTransclude from './bootstrap-transclude';

describe('Function `bootstrapTransclude`', () => {
  class TestDeclaration {}

  it('should get the transclude metadata of decorated class', () => {
    const metadata = {slot: 'testSlot'};

    Reflect.defineMetadata(tokens.transclude, metadata, TestDeclaration.prototype);

    const data = bootstrapTransclude(TestDeclaration);

    expect(data).toEqual(metadata);
  });
});
