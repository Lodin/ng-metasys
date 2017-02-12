type BootstrapLink = (declaration: any) => string;
const bootstrapLink: BootstrapLink =
  declaration =>
    Reflect.getMetadata('ngms:directive:link', declaration);

export {BootstrapLink};
export default bootstrapLink;
