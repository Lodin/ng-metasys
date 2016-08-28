import * as angular from 'angular';
import * as camelCase from 'camelcase';
import {bootstrapInject, bootstrapProperty, bootstrapTransclude} from '../extensions/bootstrap';
import {ComponentMetadata} from './component-metadata';

export function bootstrapComponent(ngModule: angular.IModule, component: any) {
  const metadata: ComponentMetadata = Reflect.getMetadata('ngms:component', component.prototype);

  const componentData: angular.IComponentOptions = {
    controller: component
  };

  if (metadata.template) {
    componentData.template = metadata.template;
  } else if (metadata.templateUrl) {
    componentData.templateUrl = metadata.templateUrl;
  }

  if (metadata.controllerAs) {
    componentData.controllerAs = metadata.controllerAs;
  }

  const injector = bootstrapInject(component);
  const properties = bootstrapProperty(component);
  const transclude = bootstrapTransclude(component);

  if (injector) {
    if (injector.hasCommon) {
      injector.injectCommon(component);
    }

    if (injector.hasProperties) {
      injector.injectProperties(component);
    }
  }

  if (properties) {
    componentData.bindings = properties;
  }

  if (transclude) {
    componentData.transclude = transclude;
  }

  const name = camelCase(metadata.selector);
  ngModule.component(name, componentData);
}
