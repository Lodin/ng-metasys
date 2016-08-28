export function Transclude(metadata?: {[slot: string]: string}) {
  return (target: any) => {
    Reflect.defineMetadata('ngms:transclude', metadata ? metadata : true, target.prototype);
  };
}
