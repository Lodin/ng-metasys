import * as angular from 'angular';
import * as camelCase from 'camelcase';
import * as tokens from '../core/tokens';
import {defineMetadata} from '../core/reflection';
import bootstrapInject from '../extensions/bootstrap-inject';
import bootstrapBind from '../extensions/bootstrap-bind';
import bootstrapTransclude from '../extensions/bootstrap-transclude';
import {ComponentMetadata} from './component-metadata';

type BootstrapComponent = (ngModule: angular.IModule, declaration: any) => void;
const bootstrapComponent: BootstrapComponent =
  (ngModule, declaration) => {
    const metadata: ComponentMetadata =
      Reflect.getMetadata(tokens.component, declaration.prototype);

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
    const properties = bootstrapBind(declaration);
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

    defineMetadata(declaration, tokens.permanent.component, {
      name,
      controllerAs: '$ctrl',
      ...data
    });
  };

export {BootstrapComponent};
export default bootstrapComponent;
