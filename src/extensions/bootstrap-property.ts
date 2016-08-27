export function bootstrapProperty(declaration: any): {[property: string]: string} {
  return Reflect.getMetadata('ngms:property', declaration);
}
