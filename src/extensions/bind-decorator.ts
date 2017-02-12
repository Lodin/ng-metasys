import * as tokens from '../core/tokens';

type BindDecorator =
  (type: string) => (target: any, property: string) => void;
const Bind: BindDecorator =
  type =>
    (target, property) => {
      if (!Reflect.hasMetadata(tokens.binding, target)) {
        Reflect.defineMetadata(tokens.binding, {[property]: type}, target);
        return;
      }

      Reflect.getMetadata(tokens.binding, target)[property] = type;
    };

export {BindDecorator};
export default Bind;
