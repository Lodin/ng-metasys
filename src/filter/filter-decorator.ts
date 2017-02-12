import * as tokens from '../core/tokens';

type FilterDecorator = (target: any) => void;
const Filter: FilterDecorator =
  target => {
    if (!target.execute || typeof target !== 'function') {
      throw new Error(`Filter ${target.name} should have static method 'execute'`);
    }

    if (target.name.slice(-6) !== 'Filter') {
      throw new Error(`Filter ${target.name} name should end with 'Filter' part`);
    }

    Reflect.defineMetadata(tokens.filter, null, target.prototype);
  };

export {FilterDecorator};
export default Filter;
