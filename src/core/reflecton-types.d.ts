type FnBased = {name: string, instance: Function};
type ClassBased = {name: string, instance: any};

export type NgmsComponent = angular.IComponentOptions & {name: string};
export type NgmsDirective = angular.IDirective & {name: string};
export type NgmsFactory = FnBased;
export type NgmsFilter = FnBased;
export type NgmsProvider = ClassBased;
export type NgmsService = ClassBased;
export type NgmsMetadata =
  NgmsComponent
  | NgmsDirective
  | NgmsFactory
  | NgmsFilter
  | NgmsProvider
  | NgmsService;
