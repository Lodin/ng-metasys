type BootstrapFunction =
  (ngModule: angular.IModule, ...injections: string[]) => void;

type RegisterPlugin = (bootstrap: BootstrapFunction, injection?: string[]) => void;

type PluginRegistryItem = {
  bootstrap: BootstrapFunction,
  injections?: string[]
};

const pluginRegistry: PluginRegistryItem[] = [];

const registerPlugin: RegisterPlugin =
  (
    bootstrap: BootstrapFunction,
    injectons?: string[]
  ) => {
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
