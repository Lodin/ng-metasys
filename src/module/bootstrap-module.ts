import * as angular from 'angular';
import * as tokens from '../core/tokens';
import {injectablePermanentList, moduleList} from '../core/token-lists';
import {modules} from '../core/reflection';
import {pluginRegistry} from '../core/plugin-registry';
import bootstrapComponent from '../component/bootstrap-component';
import bootstrapDirective from '../directive/bootstrap-directive';
import bootstrapFilter from '../filter/bootstrap-filter';
import bootstrapProviders from '../providers/bootstrap-providers';
import {ModuleMetadata} from './module-metadata';
import bootstrapModuleConfig from './bootstrap-module-config';

type InitImports = (imports: any[]) => string[];
const initImports: InitImports =
  imports => {
    const len = imports.length;
    const modules = new Array<string>(len);

    for (let i = 0; i < len; i++) {
      const importing = imports[i];

      modules[i] =
        typeof importing === 'string'
          ? importing
          : bootstrapModule(importing);
    }

    return modules;
  };

type InitDeclarations = (ngModule: angular.IModule, declarations: any[]) => void;
const initDeclarations: InitDeclarations =
  (ngModule, declarations) => {
    for (const declaration of declarations) {
      switch (true) {
        case Reflect.hasMetadata(tokens.component, declaration.prototype):
          bootstrapComponent(ngModule, declaration);
          break;
        case Reflect.hasMetadata(tokens.directive, declaration.prototype):
          bootstrapDirective(ngModule, declaration);
          break;
        case Reflect.hasMetadata(tokens.filter, declaration.prototype):
          bootstrapFilter(ngModule, declaration);
          break;
        default:
          throw new Error(`Unknown declaration ${declaration.name} in module ${ngModule.name}`);
      }
    }
  };

type InitConfig = (ngModule: angular.IModule, declaration: any) => void;
const initConfig: InitConfig =
  (ngModule, declaration) => {
    for (const type of moduleList) {
      if (!Reflect.hasMetadata(type, declaration)) {
        continue;
      }

      const properties = bootstrapModuleConfig(declaration, type);

      for (const property of properties) {
        switch (type) {
          case tokens.module.config:
            ngModule.config(declaration[property]);
            break;
          case tokens.module.run:
            ngModule.run(declaration[property]);
            break;
          case tokens.module.constant:
            ngModule.constant(property, declaration[property]);
            break;
          default:
            ngModule.value(property, declaration[property]);
            break;
        }
      }
    }
  };

type CheckMetadata = (name: string, metadata: ModuleMetadata) => void;
const checkMetadata: CheckMetadata =
  (name, metadata) => {
    let part: string|null = null;

    if (metadata.imports && metadata.imports.includes(undefined)) {
      part = 'import';
    } else if (metadata.declarations && metadata.declarations.includes(undefined)) {
      part = 'declaration';
    } else if (metadata.providers && metadata.providers.includes(undefined)) {
      part = 'provider';
    }

    if (part) {
      throw new Error(`Module ${name} has broken ${part} (one or more ${part}s are undefined)`);
    }
  };

type ConvertNames = (declarations: any[]) => string[];
const convertNames: ConvertNames =
  declarations => {
    const len = declarations.length;
    const names = new Array<string>(len);

    for (let i = 0; i < len; i++) {
      let searchSuccess = false;
      const declaration = declarations[i];

      for (const token of injectablePermanentList) {
        if (Reflect.hasMetadata(token, declaration.prototype)) {
          const metadata = Reflect.getMetadata(token, declaration.prototype);
          names[i] = metadata.name;
          searchSuccess = true;
        }
      }

      if (!searchSuccess) {
        throw new Error(`Declaration ${declaration.name} is not found in registry`);
      }
    }

    return names;
  };

type ApplyPlugins = (ngModule: angular.IModule, declaration: any) => void;
const applyPlugins: ApplyPlugins =
  (ngModule, declaration) => {
    for (const plugin of pluginRegistry) {
      const injections: string[] = plugin.injections ? convertNames(plugin.injections) : [];
      plugin.bootstrap(ngModule, declaration, ...injections);
    }
  };

type BootstrapModule = (declaration: any) => string;
const bootstrapModule: BootstrapModule =
  declaration => {
    if (modules.has(declaration.name)) {
      return declaration.name;
    }

    if (!Reflect.hasMetadata(tokens.module.self, declaration.prototype)) {
      throw new Error(`${declaration.name} is not marked with @Module decorator`);
    }

    const metadata: ModuleMetadata = Reflect.getMetadata(tokens.module.self, declaration.prototype);
    checkMetadata(declaration.name, metadata);

    const imports = metadata.imports ? initImports(metadata.imports) : [];

    const ngModule = angular.module(declaration.name, imports);
    modules.set(declaration.name, ngModule);

    if (metadata.declarations) {
      initDeclarations(ngModule, metadata.declarations);
    }

    if (metadata.providers) {
      for (const provider of metadata.providers) {
        bootstrapProviders(ngModule, provider);
      }
    }

    initConfig(ngModule, declaration);

    applyPlugins(ngModule, declaration);

    return ngModule.name;
  };

export {BootstrapModule};
export default bootstrapModule;
