type BootstrapProperty = (declaration: any) => {[property: string]: string};
const bootstrapProperty: BootstrapProperty =
  declaration =>
    Reflect.getMetadata('ngms:property', declaration.prototype);

export {BootstrapProperty};
export default bootstrapProperty;
