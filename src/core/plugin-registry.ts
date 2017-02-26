type BootstrapFunction =
  (ngModule: angular.IModule, ...injections: string[]) => void;

type RegisterPlugin = (bootstrap: BootstrapFunction, injection?: any[]) => void;

interface PluginRegistryItem {
  bootstrap: BootstrapFunction;
  injections?: any[];
}

const pluginRegistry: PluginRegistryItem[] = [];

const registerPlugin: RegisterPlugin =
  (bootstrap, injectons) => {
    const item: PluginRegistryItem = {bootstrap};

    if (injectons) {
      item.injections = injectons;
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
