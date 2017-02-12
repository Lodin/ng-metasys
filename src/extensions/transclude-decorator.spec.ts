import * as tokens from '../core/tokens';
import Transclude from './transclude-decorator';

describe('Decorator `@Transclude`', () => {
  it('should define transclude metadata for decorated declaration', () => {
    @Transclude()
    class TestDeclaration {}

    const metadata = Reflect.getMetadata(tokens.transclude, TestDeclaration.prototype);

    expect(metadata).toBeTruthy();
  });

  it('should define transclude slots for decorated declaration', () => {
    const transcludeMetadata = {slot: 'testSlot'};

    @Transclude(transcludeMetadata)
    class TestDeclaration {}

    const metadata = Reflect.getMetadata(tokens.transclude, TestDeclaration.prototype);

    expect(metadata).toEqual(transcludeMetadata);
  });
});
