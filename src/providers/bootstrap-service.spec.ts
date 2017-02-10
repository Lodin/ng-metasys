import * as angular from 'angular';
import * as ExtensionBootstrapper from '../extensions/bootstrap';
import {bootstrapService} from './bootstrap-service';
import {NgmsReflect} from '../core';

class Bootstrapper {
  public bootstrapInject = spyOn(ExtensionBootstrapper, 'bootstrapInject');
  public defineMetadata = spyOn(NgmsReflect, 'defineMetadata');

  public unarm(...toUnarm: string[]) {
    const hasAll = toUnarm.indexOf('all') !== -1;

    if (toUnarm.indexOf('inject') !== -1 || hasAll) {
      this.bootstrapInject.and.returnValue(null);
    }

    if (toUnarm.indexOf('meta') !== -1 || hasAll) {
      this.defineMetadata.and.returnValue(null);
    }
  }
}

describe('Function `bootstrapService`', () => {
  class TestService {
  }

  let ngModule: angular.IModule;
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    ngModule = angular.module('TestModule', []);
    bootstrapper = new Bootstrapper();
  });

  it('should create a service', () => {
    bootstrapper.unarm('all');

    spyOn(ngModule, 'service').and.callFake((name: string, declaration: any) => {
      expect(name).toEqual('TestService');
      expect(declaration).toEqual(TestService);
    });

    bootstrapService(ngModule, TestService);

    expect(ExtensionBootstrapper.bootstrapInject).toHaveBeenCalled();
    expect(ngModule.service).toHaveBeenCalled();
  });

  it('should add common injections to the service', () => {
    bootstrapper.unarm('meta');

    const metadata = ['$http', '$q'];

    bootstrapper.bootstrapInject.and.returnValue({
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

  it('should define a permanent metadata for a declaration', () => {
    bootstrapper.unarm('inject');

    bootstrapper.defineMetadata.and.callFake(
      (declaration: any, type: string, data: any) => {
        expect(declaration).toEqual(TestService);
        expect(type).toEqual('service');
        expect(data).toEqual({
          name: 'TestService',
          instance: TestService
        });
      });

    bootstrapService(ngModule, TestService);

    expect(bootstrapper.defineMetadata).toHaveBeenCalled();
  });
});
