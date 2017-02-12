import * as tokens from '../core/tokens';
import moduleConfigDecoratorFactory from './module-config-decorator-factory';

const Config = moduleConfigDecoratorFactory(tokens.module.config);

export default Config;
