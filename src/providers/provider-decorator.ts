import * as tokens from '../core/tokens';
import providersDecoratorFactory from './providers-decorator-factory';

const Provider = providersDecoratorFactory(tokens.providers.provider);

export default Provider;
