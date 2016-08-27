export function bootstrapTransclude(declaration: any): boolean|{[slot: string]: string} {
  return Reflect.getMetadata('ngms:transclude', declaration.prototype);
}
