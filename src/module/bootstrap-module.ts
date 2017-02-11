import * as angular from 'angular';
import {NgmsReflect} from '../core';
import {bootstrapComponent} from '../component/bootstrap';
import {bootstrapDirective} from '../directive/bootstrap';
import {bootstrapFilter} from '../filter/bootstrap';
import {bootstrapProviders} from '../providers/bootstrap';
import {ModuleMetadata} from './module-metadata';
import {bootstrapModuleConfig} from './bootstrap-module-config';

const moduleConfigTypes = ['value', 'constant', 'config', 'run'];

export function bootstrapModule(declaration: any): string {
  if (NgmsReflect.modules.has(declaration.name)) {
    return declaration.name;
  }

  if (!Reflect.hasMetadata('ngms:module', declaration.prototype)) {
    throw new Error(`${declaration.name} is not marked with @Module decorator`);
  }

  const metadata: ModuleMetadata = Reflect.getMetadata('ngms:module', declaration.prototype);
  checkMetadata(declaration.name, metadata);

  const imports = metadata.imports ? initImports(metadata.imports) : [];

  const ngModule = angular.module(declaration.name, imports);
  NgmsReflect.modules.set(declaration.name, ngModule);

  if (metadata.declarations) {
    initDeclarations(ngModule, metadata.declarations);
  }

  if (metadata.providers) {
    for (const provider of metadata.providers) {
      bootstrapProviders(ngModule, provider);
    }
  }

  initConfig(ngModule, declaration);

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
          (ngModule as any)[type](declaration[property]);
          break;
        default:
          (ngModule as any)[type](property, declaration[property]);
          break;
      }
    }
  }
}

function checkMetadata(name: string, metadata: ModuleMetadata) {
  let part: string|null = null;

  if (metadata.imports && metadata.imports.includes(undefined)) {
    part = 'import';
  } else if (metadata.declarations && metadata.declarations.includes(undefined)) {
    part = 'declaration';
  } else if (metadata.providers && metadata.providers.includes(undefined)) {
    part = 'provider';
  }

  if (part) {
    throw new Error(`Module ${name} has broken ${part} (one or more ${part}s is undefined)`);
  }
}
