import * as angular from 'angular';
import * as ExtensionBootstrapper from '../extensions/bootstrap';
import {bootstrapService} from './bootstrap-service';

describe('Function `bootstrapService`', () => {
  class TestService {
  }

  let ngModule: angular.IModule;

  beforeEach(() => {
    ngModule = angular.module('TestModule', []);
  });

  it('should create a service', () => {
    spyOn(ExtensionBootstrapper, 'bootstrapInject').and.returnValue(null);
    spyOn(ngModule, 'service').and.callFake((name: string, declaration: any) => {
      expect(name).toEqual('TestService');
      expect(declaration).toEqual(TestService);
    });

    bootstrapService(ngModule, TestService);

    expect(ExtensionBootstrapper.bootstrapInject).toHaveBeenCalled();
    expect(ngModule.service).toHaveBeenCalled();
  });

  it('should add common injections to the service', () => {
    const metadata = ['$http', '$q'];

    spyOn(ExtensionBootstrapper, 'bootstrapInject').and.returnValue({
      hasCommon: true,
      injectCommon: (declaration: any) => {
        declaration.$inject = metadata;
      }
    });

    spyOn(ngModule, 'service').and.callFake((name: string, declaration: any) => {
      expect(declaration.$inject).toEqual(metadata);
    });

    bootstrapService(ngModule, TestService);
  });

  it('should add property injections to the service', () => {
    class MockInjectService {
    }

    spyOn(ExtensionBootstrapper, 'bootstrapInject').and.returnValue({
      hasProperties: true,
      injectProperties: (declaration: any) => {
        const service = new MockInjectService();

        Object.defineProperty(declaration.prototype, 'mockInjectService', {
          configurable: false,
          enumerable: true,
          get: () => service
        });
      }
    });

    spyOn(ngModule, 'service').and.callFake((name: string, declaration: any) => {
      expect(declaration.prototype.mockInjectService).toEqual(jasmine.any(MockInjectService));
    });

    bootstrapService(ngModule, TestService);
  });
});
