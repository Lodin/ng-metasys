import * as angular from 'angular';
import * as camelCase from 'camelcase';
import {NgmsReflect} from '../core';
import {bootstrapInject, bootstrapProperty, bootstrapTransclude} from '../extensions/bootstrap';
import {ComponentMetadata} from './component-metadata';

export function bootstrapComponent(ngModule: angular.IModule, declaration: any) {
  const metadata: ComponentMetadata = Reflect.getMetadata('ngms:component', declaration.prototype);

  const data: angular.IComponentOptions = {
    controller: declaration
  };

  if (metadata.template) {
    data.template = metadata.template;
  } else if (metadata.templateUrl) {
    data.templateUrl = metadata.templateUrl;
  }

  if (metadata.controllerAs) {
    data.controllerAs = metadata.controllerAs;
  }

  const injector = bootstrapInject(declaration);
  const properties = bootstrapProperty(declaration);
  const transclude = bootstrapTransclude(declaration);

  if (injector && injector.hasCommon) {
    injector.injectCommon(declaration);
  }

  if (properties) {
    data.bindings = properties;
  }

  if (transclude) {
    data.transclude = transclude;
  }

  const name = camelCase(metadata.selector);
  ngModule.component(name, data);

  NgmsReflect.defineMetadata(declaration, 'component', Object.assign({
    name,
    controllerAs: '$ctrl'
  }, data));
}
