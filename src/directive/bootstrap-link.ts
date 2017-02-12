import * as tokens from '../core/tokens';

type BootstrapLink = (declaration: any) => string;
const bootstrapLink: BootstrapLink =
  declaration =>
    Reflect.getMetadata(tokens.directive.link, declaration);

export {BootstrapLink};
export default bootstrapLink;
