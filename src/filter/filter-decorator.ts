export function Filter(target: any) {
  if (!target.execute || typeof target !== 'function') {
    throw new Error(`Filter ${target.name} should have static method 'execute'`);
  }

  if (target.name.slice(-6) !== 'Filter') {
    throw new Error(`Filter ${target.name} name should end with 'Filter' part`);
  }

  Reflect.defineMetadata('ngms:filter', null, target.prototype);
}
