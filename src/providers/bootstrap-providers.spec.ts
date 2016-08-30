import * as angular from 'angular';
import * as FactoryBoottrapper from './bootstrap-factory';
import * as ProviderBootstrapper from './bootstrap-provider';
import * as ServiceBootstrapper from './bootstrap-service';
import {bootstrapProviders} from './bootstrap-providers';

class Bootstrapper {
  public bootstrapFactory = spyOn(FactoryBoottrapper, 'bootstrapFactory');
  public bootstrapProvider = spyOn(ProviderBootstrapper, 'bootstrapProvider');
  public bootstrapService = spyOn(ServiceBootstrapper, 'bootstrapService');

  constructor() {
    this.bootstrapFactory.and.returnValue(null);
    this.bootstrapProvider.and.returnValue(null);
    this.bootstrapService.and.returnValue(null);
  }

  getByType(type: string): Function {
    switch (type) {
      case 'factory':
        return this.bootstrapFactory;
      case 'provider':
        return this.bootstrapProvider;
      case 'service':
        return this.bootstrapService;
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
