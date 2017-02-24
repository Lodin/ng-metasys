import * as tokens from '../core/tokens';
import bootstrapTransclude from './bootstrap-transclude';
import Transclude from './transclude-decorator';

describe('Function `bootstrapTransclude`', () => {
  class TestDeclaration {}

  it('should get the transclude metadata of decorated class', () => {
    const metadata = {slot: 'testSlot'};

    Reflect.defineMetadata(tokens.transclude, metadata, TestDeclaration.prototype);

    expect(bootstrapTransclude(TestDeclaration)).toEqual(metadata);
  });
});

describe('Decorator `Transclude` and function `bootstrapTransclude`', () => {
  it('should work together', () => {
    const metadata = {slot: 'testSlot'};

    @Transclude(metadata)
    class TestDeclaration {}

    expect(bootstrapTransclude(TestDeclaration)).toEqual(metadata);
  });
});
