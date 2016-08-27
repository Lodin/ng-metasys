export function bootstrapLink(declaration: any) {
  return Reflect.getMetadata('ngms:directive:link', declaration);
}
