import {ComponentMetadata} from './component-metadata';

export function Component(metadata: ComponentMetadata) {
  return (target: any) => {
    if (!metadata.selector) {
      throw new Error(`Component ${target.name} should have a selector`);
    }

    Reflect.defineMetadata('ngms:component', metadata, target.prototype);
  };
}
