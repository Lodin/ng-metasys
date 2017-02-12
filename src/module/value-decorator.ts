import * as tokens from '../core/tokens';
import moduleConfigDecoratorFactory from './module-config-decorator-factory';

const Value = moduleConfigDecoratorFactory(tokens.module.value);

export default Value;
