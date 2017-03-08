import * as tokens from '../core/tokens';
import {SlotCollection} from './slot-collection';

type BootstrapTransclude = (declaration: any) => boolean|SlotCollection|null;
const bootstrapTransclude: BootstrapTransclude =
  declaration =>
    Reflect.getMetadata(tokens.transclude, declaration.prototype);

export {BootstrapTransclude};
export default bootstrapTransclude;
