import * as tokens from './tokens';

export const permanentList = [
  tokens.permanent.component,
  tokens.permanent.service,
  tokens.permanent.directive,
  tokens.permanent.filter,
  tokens.permanent.factory,
  tokens.permanent.provider
];

export const providersList = [
  tokens.providers.service,
  tokens.providers.factory,
  tokens.providers.provider
];

export const injectList = [
  tokens.inject.self,
  tokens.inject.param,
  tokens.inject.method
];

export const directiveList = [
  tokens.directive.self,
  tokens.directive.link
];

export const moduleList = [
  tokens.module.self,
  tokens.module.config,
  tokens.module.run,
  tokens.module.value,
  tokens.module.constant
];

export const providers = [
  tokens.providers.service,
  tokens.providers.factory,
  tokens.providers.provider
];
