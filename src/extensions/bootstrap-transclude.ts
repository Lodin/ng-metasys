import {SlotCollection} from './slot-collection';

type BootstrapTransclude = (declaration: any) => boolean|SlotCollection;
const bootstrapTransclude: BootstrapTransclude =
  declaration =>
    Reflect.getMetadata('ngms:transclude', declaration.prototype);

export {BootstrapTransclude};
export default bootstrapTransclude;
