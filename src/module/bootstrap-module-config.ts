import bootstrapInject from '../extensions/bootstrap-inject';

type BootstrapModuleConfig = (declaration: any, type: symbol) => any[];
const bootstrapModuleConfig: BootstrapModuleConfig =
  (declaration, type) => {
    const properties = Reflect.getMetadata(type, declaration);

    for (const property of properties) {
      const inject = bootstrapInject(declaration);

      if (inject.hasMethods) {
        inject.injectMethods(declaration, property);
      }
    }

    return properties;
  };

export {BootstrapModuleConfig};
export default bootstrapModuleConfig;
