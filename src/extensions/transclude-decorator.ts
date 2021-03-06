import * as tokens from '../core/tokens';
import {SlotCollection} from './slot-collection';

type TranscludeDecorator = (metadata?: SlotCollection) => (target: any) => void;
const Transclude: TranscludeDecorator =
  metadata =>
    target =>
      Reflect.defineMetadata(tokens.transclude, metadata ? metadata : true, target.prototype);

export {TranscludeDecorator};
export default Transclude;
