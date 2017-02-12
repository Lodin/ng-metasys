import * as tokens from '../core/tokens';
import moduleConfigDecoratorFactory from './module-config-decorator-factory';

const Constant = moduleConfigDecoratorFactory(tokens.module.constant);

export default Constant;
