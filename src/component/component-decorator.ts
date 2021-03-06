import * as tokens from '../core/tokens';
import {ComponentMetadata} from './component-metadata';

type ComponentDecorator = (metadata: ComponentMetadata) => (target: any) => void;
const Component: ComponentDecorator =
  metadata =>
    target => {
      if (!metadata.selector) {
        throw new Error(`Component ${target.name} should have a selector`);
      }

      Reflect.defineMetadata(tokens.component, metadata, target.prototype);
    };

export {ComponentDecorator};
export default Component;
