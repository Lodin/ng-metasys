import * as angular from 'angular';
import {NgmsReflect} from '../core';
import bootstrapInject from '../extensions/bootstrap-inject';
import bootstrapProperty from '../extensions/bootstrap-property';
import bootstrapTransclude from '../extensions/bootstrap-transclude';
import {DirectiveMetadata} from './directive-metadata';
import bootstrapLink from './bootstrap-link';
import parseSelector from './parse-selector';

type BootstrapDirective = (ngModule: angular.IModule, declaration: any) => void;
const bootstrapDirective: BootstrapDirective =
  (ngModule, declaration) => {
    const metadata: DirectiveMetadata =
      Reflect.getMetadata('ngms:directive', declaration.prototype);

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

    if (injector && injector.hasCommon) {
      injector.injectCommon(declaration);
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
  };

export {BootstrapDirective};
export default bootstrapDirective;
