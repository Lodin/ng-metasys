import * as tokens from '../core/tokens';
import providersDecoratorFactory from './providers-decorator-factory';

const Service = providersDecoratorFactory(tokens.providers.service);

export default Service;
