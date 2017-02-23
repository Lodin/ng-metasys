import registerPlugin, {pluginRegistry} from './plugin-registry';

describe('Function `registerPlugin`', () => {
  let bootstrap: jasmine.Spy;

  beforeEach(() => {
    bootstrap = jasmine.createSpy('Plugin#bootstrap');
  });

  afterEach(() => {
    pluginRegistry.length = 0;
  });

  it('should register plugin', () => {
    registerPlugin(bootstrap as any);
    expect(pluginRegistry).toEqual([{bootstrap}]);
  });

  it('should register plugin with injections', () => {
    class TestService {}
    class TestProvider {}

    registerPlugin(bootstrap as any, [TestService, TestProvider]);
    expect(pluginRegistry).toEqual([{bootstrap, injections: [TestService, TestProvider]}]);
  });
});
