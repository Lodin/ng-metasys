export const component = Symbol('component');
export const binding = Symbol('binding');
export const transclude = Symbol('transclude');
export const filter = Symbol('filter');

export const permanent = {
  component: Symbol('permanent:component'),
  directive: Symbol('permanent:directive'),
  filter: Symbol('permanent:filter'),
  service: Symbol('permanent:service'),
  factory: Symbol('permanent:factory'),
  provider: Symbol('permanent:provider')
};

export const directive = {
  self: Symbol('directive'),
  link: Symbol('directive:link')
};

export const inject = {
  self: Symbol('inject'),
  method: Symbol('method'),
  param: Symbol('param')
};

export const module = {
  self: Symbol('module'),
  config: Symbol('module:config'),
  constant: Symbol('module:constant'),
  run: Symbol('module:run'),
  value: Symbol('module:value')
};

export const providers = {
  factory: Symbol('providers:factory'),
  provider: Symbol('providers:provider'),
  service: Symbol('providers:service')
};
