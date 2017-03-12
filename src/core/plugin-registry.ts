type BootstrapFunction =
  (ngModule: angular.IModule, declaration: any, ...injections: string[]) => void;

interface PluginRegistryItem {
  bootstrap: BootstrapFunction;
  injections?: any[];
}

const pluginRegistry: PluginRegistryItem[] = [];

type RegisterPlugin = (bootstrap: BootstrapFunction, injections?: any[]) => void;
const registerPlugin: RegisterPlugin =
  (bootstrap, injections) => {
    const item: PluginRegistryItem = {bootstrap};

    if (injections) {
      item.injections = injections;
    }

    pluginRegistry.push(item);
  };

export {
  BootstrapFunction,
  RegisterPlugin,
  PluginRegistryItem,
  pluginRegistry
}

export default registerPlugin;
