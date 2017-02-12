import * as tokens from '../core/tokens';
import {DirectiveMetadata} from './directive-metadata';

type DirectiveDecorator = (metadata: DirectiveMetadata) => (target: any) => void;
const Directive: DirectiveDecorator =
  metadata =>
    target => {
      if (!metadata.selector) {
        throw new Error(`Directive ${target.name} should have a selector`);
      }

      Reflect.defineMetadata(tokens.directive.self, metadata, target.prototype);
    };

export {DirectiveDecorator};
export default Directive;
