import * as angular from 'angular';
import {moduleList} from '../core';
import {bootstrapComponent} from '../component/bootstrap';
import {bootstrapDirective} from '../directive/bootstrap';
import {bootstrapFilter} from '../filter/bootstrap';
import {bootstrapProviders} from '../providers/bootstrap';
import {ModuleMetadata} from './module-metadata';
import {bootstrapModuleConfig} from './bootstrap-module-config';

const moduleConfigTypes = ['value', 'constant', 'config', 'run'];

export function bootstrapModule(module: any): string {
  if (!Reflect.hasMetadata('ngms:module', module.prototype)) {
    throw new Error(`${module.name} is not marked with @Module decorator`);
  }

  const metadata: ModuleMetadata = Reflect.getMetadata('ngms:module', module.prototype);

  const imports = metadata.imports ? initImports(metadata.imports) : [];

  const ngModule = angular.module(module.name, imports);
  moduleList.set(module.name, ngModule);

  if (metadata.declarations) {
    initDeclarations(ngModule, metadata.declarations);
  }

  initConfig(ngModule, module);

  if (metadata.providers) {
    for (const provider of metadata.providers) {
      bootstrapProviders(ngModule, provider);
    }
  }

  return ngModule.name;
}

function initImports(imports: any[]): string[] {
  let i = 0;
  const modules = new Array<string>(imports.length);
  for (const importing of imports) {
    modules[i] = typeof importing === 'string' ? importing : bootstrapModule(importing);
    i += 1;
  }

  return modules;
}

function initDeclarations(ngModule: angular.IModule, declarations: any[]) {
  for (const declaration of declarations) {
    switch (true) {
      case Reflect.hasMetadata('ngms:component', declaration.prototype):
        bootstrapComponent(ngModule, declaration);
        break;
      case Reflect.hasMetadata('ngms:directive', declaration.prototype):
        bootstrapDirective(ngModule, declaration);
        break;
      case Reflect.hasMetadata('ngms:filter', declaration.prototype):
        bootstrapFilter(ngModule, declaration);
        break;
      default:
        throw new Error(`Unknown declaration ${declaration.name} in module ${ngModule.name}`);
    }
  }
}

function initConfig(ngModule: angular.IModule, declaration: any) {
  for (const type of moduleConfigTypes) {
    if (!Reflect.hasMetadata(`ngms:module:${type}`, declaration)) {
      continue;
    }

    const properties = bootstrapModuleConfig(declaration, type);

    for (const property of properties) {
      switch (type) {
        case 'config':
        case 'run':
          (<any> ngModule)[type](declaration[property]);
          break;
        default:
          (<any> ngModule)[type](property, declaration[property]);
          break;
      }
    }
  }
}
