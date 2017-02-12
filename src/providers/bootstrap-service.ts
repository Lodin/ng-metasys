import * as angular from 'angular';
import * as tokens from '../core/tokens';
import bootstrapInject from '../extensions/bootstrap-inject';
import {NgmsReflect} from '../core/ngms-reflect';

type BootstrapService = (ngModule: angular.IModule, declaration: any) => void;
const bootstrapService: BootstrapService =
  (ngModule, declaration) => {
    const inject = bootstrapInject(declaration);

    if (inject && inject.hasCommon) {
      inject.injectCommon(declaration);
    }

    ngModule.service(declaration.name, declaration);

    NgmsReflect.defineMetadata(declaration, tokens.permanent.service, {
      name: declaration.name,
      instance: declaration
    });
  };

export {BootstrapService};
export default bootstrapService;
