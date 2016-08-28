import * as angular from 'angular';
import {bootstrapInject, bootstrapProperty, bootstrapTransclude} from '../extensions/bootstrap';
import {DirectiveMetadata} from './directive-metadata';
import {bootstrapLink} from './bootstrap-link';
import {parseSelector} from './parse-selector';

export function bootstrapDirective(ngModule: angular.IModule, directive: any) {
  const metadata: DirectiveMetadata = Reflect.getMetadata('ngms:directive', directive.prototype);

  const directiveData: angular.IDirective = {
    controller: directive,
    scope: true
  };

  if (metadata.template) {
    directiveData.template = metadata.template;
  } else if (metadata.templateUrl) {
    directiveData.templateUrl = metadata.templateUrl;
  }

  if (metadata.controllerAs) {
    directiveData.controllerAs = metadata.controllerAs;
  } else {
    directiveData.controllerAs = '$ctrl';
  }

  const injector = bootstrapInject(directive);
  const properties = bootstrapProperty(directive);
  const transclude = bootstrapTransclude(directive);
  const link = bootstrapLink(directive);

  if (injector) {
    if (injector.hasCommon) {
      injector.injectCommon(directive);
    }

    if (injector.hasProperties) {
      injector.injectProperties(directive);
    }
  }

  if (properties) {
    directiveData.bindToController = properties;
  }

  if (transclude) {
    directiveData.transclude = transclude;
  }

  if (link) {
    directiveData.link = directive[link];
  }

  const [name, restrict] = parseSelector(metadata.selector);
  directiveData.restrict = restrict;
  ngModule.directive(name, () => directiveData);
}
