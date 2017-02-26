import * as tokens from '../core/tokens';
import * as bootstrapFactory from './bootstrap-factory';
import * as bootstrapProvider from './bootstrap-provider';
import * as bootstrapService from './bootstrap-service';
import bootstrapProviders from './bootstrap-providers';

class Bootstrapper {
  public bootstrapFactory = spyOn(bootstrapFactory, 'default');
  public bootstrapProvider = spyOn(bootstrapProvider, 'default');
  public bootstrapService = spyOn(bootstrapService, 'default');

  constructor() {
    this.bootstrapFactory.and.returnValue(null);
    this.bootstrapProvider.and.returnValue(null);
    this.bootstrapService.and.returnValue(null);
  }

  public getByType(type: symbol): Function|null {
    switch (type) {
      case tokens.providers.factory:
        return this.bootstrapFactory;
      case tokens.providers.provider:
        return this.bootstrapProvider;
      case tokens.providers.service:
        return this.bootstrapService;
      default:
        return null;
    }
  }
}

describe('Function `bootstrapProviders`', () => {
  class TestProvider {}

  let ngModule: any;
  let bootstrapper: Bootstrapper;

  const testProviders = (type: symbol) => {
    Reflect.defineMetadata(type, null, TestProvider.prototype);

    bootstrapProviders(ngModule, TestProvider);

    expect(bootstrapper.getByType(type)).toHaveBeenCalled();
  };

  beforeEach(() => {
    ngModule = {name: 'TestModule'};
    bootstrapper = new Bootstrapper();
  });

  afterEach(() => {
    Reflect.deleteMetadata(tokens.providers.factory, TestProvider.prototype);
    Reflect.deleteMetadata(tokens.providers.provider, TestProvider.prototype);
    Reflect.deleteMetadata(tokens.providers.service, TestProvider.prototype);
  });

  it('should bootstrap factories', () => {
    testProviders(tokens.providers.factory);
  });

  it('should bootstrap factories', () => {
    testProviders(tokens.providers.provider);
  });

  it('should bootstrap factories', () => {
    testProviders(tokens.providers.service);
  });

  it('should throw an error if provider does not have any metadata', () => {
    expect(() => {
      class TestProviderError {}
      bootstrapProviders(ngModule, TestProviderError);
    }).toThrow();
  });
});
