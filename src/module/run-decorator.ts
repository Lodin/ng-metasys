import * as tokens from '../core/tokens';
import moduleConfigDecoratorFactory from './module-config-decorator-factory';

const Run = moduleConfigDecoratorFactory(tokens.module.run);

export default Run;
