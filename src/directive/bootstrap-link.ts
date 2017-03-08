import * as tokens from '../core/tokens';

type BootstrapLink = (declaration: any) => string|null;
const bootstrapLink: BootstrapLink =
  declaration =>
    Reflect.getMetadata(tokens.directive.link, declaration);

export {BootstrapLink};
export default bootstrapLink;
