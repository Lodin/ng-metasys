import * as tokens from '../core/tokens';
import Component from './component-decorator';
import {ComponentMetadata} from './component-metadata';

describe('Decorator `@Component`', () => {
  it('should add a component metadata to a decorated class', () => {
    const metadata = {
      selector: 'app-test',
      template: '<div></div>'
    };

    @Component(metadata)
    class TestComponent {}

    const reflectedMeta = Reflect.getMetadata(tokens.component, TestComponent.prototype);

    expect(reflectedMeta).toEqual(metadata);
  });

  it('should throw an error if selector is not set', () => {
    expect(() => {
      @Component({} as ComponentMetadata)
      class TestComponent {}
    }).toThrow();
  });
});
