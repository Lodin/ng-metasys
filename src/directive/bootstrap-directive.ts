import * as angular from 'angular';
import {NgmsReflect} from '../core';
import {bootstrapInject, bootstrapProperty, bootstrapTransclude} from '../extensions/bootstrap';
import {DirectiveMetadata} from './directive-metadata';
import {bootstrapLink} from './bootstrap-link';
import {parseSelector} from './parse-selector';

export function bootstrapDirective(ngModule: angular.IModule, declaration: any) {
  const metadata: DirectiveMetadata = Reflect.getMetadata('ngms:directive', declaration.prototype);

  const data: angular.IDirective = {
    controller: declaration,
    scope: true
  };

  if (metadata.template) {
    data.template = metadata.template;
  } else if (metadata.templateUrl) {
    data.templateUrl = metadata.templateUrl;
  }

  if (metadata.controllerAs) {
    data.controllerAs = metadata.controllerAs;
  } else {
    data.controllerAs = '$ctrl';
  }

  const injector = bootstrapInject(declaration);
  const properties = bootstrapProperty(declaration);
  const transclude = bootstrapTransclude(declaration);
  const link = bootstrapLink(declaration);

  if (injector) {
    if (injector.hasCommon) {
      injector.injectCommon(declaration);
    }

    if (injector.hasProperties) {
      injector.injectProperties(declaration.prototype, ngModule);
    }
  }

  if (properties) {
    data.bindToController = properties;
  }

  if (transclude) {
    data.transclude = transclude;
  }

  if (link) {
    data.link = declaration[link];
  }

  const [name, restrict] = parseSelector(metadata.selector);
  data.restrict = restrict;

  ngModule.directive(name, () => data);

  NgmsReflect.defineMetadata(declaration, 'directive', Object.assign({name}, data));
}
