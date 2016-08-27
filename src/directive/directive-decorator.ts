import {DirectiveMetadata} from './directive-metadata';

export function Directive(metadata: DirectiveMetadata) {
  return (target: any) => {
    if (!metadata.selector) {
      throw new Error(`Directive ${target.name} should have a selector`);
    }

    Reflect.defineMetadata('ngms:directive', metadata, target.prototype);
  };
}
