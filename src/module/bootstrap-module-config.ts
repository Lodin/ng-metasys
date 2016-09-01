import {bootstrapInject} from '../extensions/bootstrap';

export function bootstrapModuleConfig(declaration: any,
                                      type: string): any[] {
  const properties = Reflect.getMetadata(`ngms:module:${type}`, declaration);

  for (const property of properties) {
    const inject = bootstrapInject(declaration);

    if (inject && inject.hasMethods) {
      inject.injectMethods(declaration, property);
    }
  }

  return properties;
}
