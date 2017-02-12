import {DirectiveMetadata} from './directive-metadata';

type DirectiveDecorator = (metadata: DirectiveMetadata) => (target: any) => void;
const Directive: DirectiveDecorator =
  metadata =>
    target => {
      if (!metadata.selector) {
        throw new Error(`Directive ${target.name} should have a selector`);
      }

      Reflect.defineMetadata('ngms:directive', metadata, target.prototype);
    };

export {DirectiveDecorator};
export default Directive;
