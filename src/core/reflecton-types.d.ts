interface FnBased {
  name: string;
  instance: Function;
}

interface ClassBased {
  name: string;
  instance: any;
}

export interface NgmsComponent extends angular.IComponentOptions {
  name: string;
}

export interface NgmsDirective extends angular.IDirective {
  name: string;
}

export interface NgmsFactory extends FnBased {}
export interface NgmsFilter extends FnBased {}
export interface NgmsProvider extends ClassBased {}
export interface NgmsService extends ClassBased {}

export type NgmsMetadata =
  NgmsComponent
  | NgmsDirective
  | NgmsFactory
  | NgmsFilter
  | NgmsProvider
  | NgmsService;
