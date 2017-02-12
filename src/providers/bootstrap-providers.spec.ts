import * as angular from 'angular';
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

  public getByType(type: string): Function|null {
    switch (type) {
      case 'factory':
        return this.bootstrapFactory;
      case 'provider':
        return this.bootstrapProvider;
      case 'service':
        return this.bootstrapService;
      default:
        return null;
    }
  }
}

describe('Function `bootstrapProviders`', () => {
  class TestProvider {}

  let ngModule: angular.IModule;
  let bootstrapper: Bootstrapper;

  const testProviders = (type: string) => {
    Reflect.defineMetadata(`ngms:providers:${type}`, null, TestProvider.prototype);

    bootstrapProviders(ngModule, TestProvider);

    expect(bootstrapper.getByType(type)).toHaveBeenCalled();
  };

  beforeEach(() => {
    ngModule = angular.module('TestModule', []);
    bootstrapper = new Bootstrapper();
  });

  afterEach(() => {
    Reflect.deleteMetadata('ngms:providers:factory', TestProvider.prototype);
    Reflect.deleteMetadata('ngms:providers:provider', TestProvider.prototype);
    Reflect.deleteMetadata('ngms:providers:servide', TestProvider.prototype);
  });

  it('should bootstrap factories', () => {
    testProviders('factory');
  });

  it('should bootstrap factories', () => {
    testProviders('provider');
  });

  it('should bootstrap factories', () => {
    testProviders('service');
  });

  it('should throw an error if provider does not have any metadata', () => {
    expect(() => {
      class TestProviderError {}
      bootstrapProviders(ngModule, TestProviderError);
    }).toThrow();
  });
});
