import * as angular from 'angular';
import {defineMetadata} from '../core/reflection';
import * as tokens from '../core/tokens';
import bootstrapInject from '../extensions/bootstrap-inject';

type ReduceName = (filterName: string) => string;
const reduceName: ReduceName =
  name =>
    name.slice(0, name.indexOf('Filter'));

type BootstrapFilter = (ngModule: angular.IModule, declaration: any) => void;
const bootstrapFilter: BootstrapFilter =
  (ngModule, declaration) => {
    const inject = bootstrapInject(declaration);

    if (inject.hasMethods) {
      inject.injectMethods(declaration, 'execute');
    }

    const name = reduceName(declaration.name);
    ngModule.filter(name.toLowerCase(), declaration.execute);

    defineMetadata(declaration, tokens.permanent.filter, {
      name,
      instance: declaration.execute
    });
  };

export {BootstrapFilter};
export default bootstrapFilter;
