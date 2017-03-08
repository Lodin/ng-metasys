import * as tokens from '../core/tokens';

type BootstrapBind = (declaration: any) => {[binding: string]: string}|null;
const bootstrapBind: BootstrapBind =
  declaration =>
    Reflect.getMetadata(tokens.binding, declaration.prototype);

export {BootstrapBind};
export default bootstrapBind;
