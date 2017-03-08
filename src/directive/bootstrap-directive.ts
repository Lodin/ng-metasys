import * as angular from 'angular';
import {defineMetadata} from '../core/reflection';
import * as tokens from '../core/tokens';
import bootstrapInject from '../extensions/bootstrap-inject';
import bootstrapBind from '../extensions/bootstrap-bind';
import bootstrapTransclude from '../extensions/bootstrap-transclude';
import {SlotCollection} from '../extensions/slot-collection';
import {DirectiveMetadata} from './directive-metadata';
import bootstrapLink from './bootstrap-link';
import parseSelector from './parse-selector';

type BootstrapDirective = (ngModule: angular.IModule, declaration: any) => void;
const bootstrapDirective: BootstrapDirective =
  (ngModule, declaration) => {
    const metadata: DirectiveMetadata =
      Reflect.getMetadata(tokens.directive.self, declaration.prototype);

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
    const bindings = bootstrapBind(declaration);
    const transclude = bootstrapTransclude(declaration);
    const link = bootstrapLink(declaration);

    if (injector.hasCommon) {
      injector.injectCommon(declaration);
    }

    if (bindings) {
      data.bindToController = bindings as {[binding: string]: string};
    }

    if (transclude) {
      data.transclude = transclude as boolean|SlotCollection;
    }

    if (link) {
      data.link = declaration[link as string];
    }

    const [name, restrict] = parseSelector(metadata.selector);
    data.restrict = restrict;

    ngModule.directive(name, () => data);

    defineMetadata(declaration, tokens.permanent.directive, {
      name,
      ...data
    });
  };

export {BootstrapDirective};
export default bootstrapDirective;
