import * as tokens from '../core/tokens';

type BootstrapBind = (declaration: any) => {[property: string]: string};
const bootstrapBind: BootstrapBind =
  declaration =>
    Reflect.getMetadata(tokens.binding, declaration.prototype);

export {BootstrapBind};
export default bootstrapBind;
