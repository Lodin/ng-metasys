type BootstrapBind = (declaration: any) => {[property: string]: string};
const bootstrapBind: BootstrapBind =
  declaration =>
    Reflect.getMetadata('ngms:binding', declaration.prototype);

export {BootstrapBind};
export default bootstrapBind;
