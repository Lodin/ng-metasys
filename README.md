# ng-metasys
A metadata framework for AngularJS 1.5.x that makes default angular
metadata system working clearly with ES2015/Typescript module system.

This framework has no aim to emulate Angular 2 DI system. Instead, it 
considers Angular 1.5.x features and offers an architecture that 
is convenient for it. 

## Installation
```shell
$ npm install ng-metasys --save
```

## Usage
### bootstrap
Everything starts with `bootstrap` function. If you choose the
`ng-metasys` package, you should understand, that you will not 
be able to use angular auto-bootstrapping with `ngApp` directive.

The bootstrap function has to be placed at the enter point of 
your application. It receives a class marked with `@Module` 
decorator and bootstraps it. 

Bootstrap function signature is:
```typescript
function bootstrap(module: any, element: HTMLElement = document.body) {}
```

Your application entry point can look like this.
```javascript
import {bootstrap} from 'ng-metasys/core';
import {AppModule} from './app/app.module.js';

bootstrap(AppModule);
```

### @Module
Module is the fundamental Angular entity that encapsulates one
structural unit of the application. It contains all submodules,
declarations and configurations of this unit. 

Default Angular module initialization is far away from 
ES2015/Typescript module system. So, `ng-metasys` offers following
initialization through separate module class, that contains 
`@Module` decorator with information about declarations 
and module import and class methods that implements module 
configuration.

More about [Angular Module](https://docs.angularjs.org/guide/module)

`@Module` has following signature:
```typescript
interface ModuleMetadata {
  imports: any[], // All modules this module depends on
  declarations: any[] // Components and directives declarations of this module
  providers: any[] // Fabrics, services and other providers belongs to this module
}
```

Your `app.module.js` can look like following:
```javascript
import {Inject} from 'ng-metasys/core';
import {Module, Config, Run, Value, Constant} from 'ng-metasys/module';
import {Submodule} from './app/submodule/submodule.module';
import {AppComponent} from './app/app.component';
import {AppService} from './app/app.service';

@Module({
  imports: ['LocalStorageModule', Submodule],
  declarations: [AppComponent],
  providers: [AppService]
})
export class AppModule {
  @Value value = 1;
  @Constant constant = 'two';
  
  @Config
  @Inject('$q')
  config($q) {}

  @Run
  run() {}
}
```
This code is equivalent to the following:
```javascript
angular.module('AppModule', ['LocalStorageModule', 'Submodule'])
  .value('value', 1)
  .constant('constant', 'two')
  .config(['$q', function config($q) {}])
  .run(function run() {})
  .component('appComponent', function AppComponent() {})
  .service('appService', function AppService() {});
```

### @Component
Component is the one more fundamental entity that encapsulates view and 
behavior of single visual part of application.

More about [Angular Component](https://docs.angularjs.org/guide/component).

`@Component` signature is simple:
```typescript
interface ComponentMetadata {
  selector: string, // should be just a name of tag, not class or id selector
  template?: string,
  templateUrl?: string 
}
```
`@Component` can be expanded by additional functional like `ng-transclude`
using the core decorators from `ng-metasys/core`.

Your `app.component.js` can look like following:
```javascript
import {Inject, Transclude, Property} from 'ng-metasys/core';
import {Component} from 'ng-metasys/component';

@Component({
  selector: 'my-app',
  template: `
    <div class="container">
      <ng-transclude></ng-transclude>
    </div>
  `
})
@Transclude()
export class AppComponent {
  @Inject('$http') $http;
  @Inject('$q') $q;
  
  @Property('<') $router;
  @Property('&') onClick;
}
```
Which is an equivalent to the following code:
```javascript
angular.module('AppModule')
  .component('myApp', {
    template: '<div class="container"><ng-transclude></ng-transclude></div>',
    transclude: true,
    controller: ['$http', '$q', function AppComponent($http, $q) {
      this.$http = $http;
      this.$q = $q;
    }],
    bindings: {
      $router: '<',
      onClick: '&'
    }
  })
```

### @Directive
Directive controls behavior of HTML elements marked with certain 
attribute or class. 

More about [Angular Directive](https://docs.angularjs.org/guide/directive).

`@Directive` signature is equal to `@Component`:
```typescript
interface DirectiveMetadata {
  selector: string; // should be class, attribute or comment
  template?: string;
  templateUrl?: string;
  controllerAs?: string;
}
```
If directive should be applied to the element with attribute, it
selector has to look like that:
```javascript
@Directive({
  selector: '[some-attribute]'
})
```
If directive should be applied to some class, it has to be following:
```javascript
@Directive({
  selector: '.some-class'
})
```
If directive should be applied to some comment, it has to be following:
```javascript
@Directive({
  selector: '//some-comment'
})
```
Unlike component, directive can contain a static method marked with 
`@Link` decorator. It creates a directive link function that allow
to control HTML elements directly. 

Your `some.directive.js` can look like following:
```javascript
import {Inject, Property} from 'ng-metasys/core';
import {Directive, Link} from 'ng-metasys/directive';

@Directive({
  selector: '[some-directive]',
  templateUrl: 'some.directive.html'
})
export class SomeDirective {
  @Inject('$q') $q;
  
  @Property('&') close;
  
  @Link
  static link(scope, element, attrs, controllers) {}
}
```
Which is equivalent to the following code:
```javascript
angular.module('AppModule')
  .directive('someDirective', function() {
    return {
      restrict: 'A',
      templateUrl: 'some.directive.html',
      scope: true,
      bindToController: {
        close: '&'
      },
      controller: ['$q', function SomeDirective($q) {
        this.$q = $q;
      }],
      link: function link(scope, element, attrs, controllers) {}
    }
  });
```

## @Service
Injectable provider that implements concept of singletone data service.

More: [Angular Service](https://docs.angularjs.org/guide/services).

`@Service` does not have signature. Just place a `@Service` mark above
the class to make it Angular Service.

Your `some.service.js` can look like following.
```javascript
import {Inject} from 'ng-metasys/core';
import {Service} from 'ng-metasys/providers';

@Service
export class SomeService {
  @Inject('$http') $http;
  
  constructor() {}
}
```
Which is equivalent to the following code:
```javascript
angular.module('AppModule')
  .service('someService', ['$http', function SomeService($http) {
    this.$http = $http; 
  }]);
```

## @Factory
Factory is a function shared in AngularJS. To implement it using 
`@Factory` mark just create a class with static method `$get`.
 
More: [Angular Factory](https://docs.angularjs.org/guide/providers)
 
Your file `some.factory.js` can look like following:
```javascript
import {Inject} from 'ng-metasys/core';
import {Factory} from 'ng-metasys/providers';

@Factory
export class SomeFactory {
  
  @Inject('$http')
  static $get($http) {}
}
```
Which is equivalent to the following code:
```javascript
angular.module('AppModule')
  .factory('someFactory', ['$http', function execute($http) {}]);
```

## @Provider
Basic structure for `@Service` and `@Fabric`. To implement `@Provider`
you should create a class with the method `$get`. 

Your file `some.provider.js` can look like following:
```javascript
import {Inject} from 'ng-metasys/core';
import {Provider} from 'ng-metasys/providers';

@Provider
export class SomeProvider {
  
  @Inject('$http')
  $get($http) {}
}
```
Which is an equivalent to the following code:
```javascript
angular.module('AppModule')
  .provider('someProvider', function SomeProvider() {
    this.$get = ['$http', function $get($http) {}];
  });
```

## @Filter
Filter in AngularJS allows to process text data with certain pattern 
defined by filter. To implement it using `@Filter` mark just create a 
class with static method `execute`.

Your `some.filter.js` can look like following:
```javascript
import {Inject} from 'ng-metasys/core';
import {Filter} from 'ng-metasys/filter';

@Filter
export class SomeFilter {
  
  @Inject('$q')
  static execute($q) {
    return (input, params) => {}
  }
}
```
Which is an equivalent to the following code:
```javascript
angular.module('AppModule')
  .filter('someFilter', ['$q', function execute($q) { 
    return function(input, params) {}
  }]);
```

## Core metadata
Core metadata is the set of decorators that can be used in different 
AngularJS elements.

### @Inject
`@Inject` allows to inject various providers into components, directives,
other providers etc. `@Inject` can be used in following ways:

* Inject into the class field:
```javascript
import {Inject} from 'ng-metasys/core';
import {Service} from 'ng-metasys/providers';
import {SomeService} from './app/some.service';

@Service
export class SomeService {
  @Inject('$http') $http;
}
```
It is mean that after `constructor` `SomeService` can use `$http` service
in it's methods. Equivalent code:
```javascript
angular.module('AppModule')
  .service('someService', ['$http', function SomeService($http) {
    this.$http = $http;
  }]);
```

* Inject into constructor:
```javascript
import {Inject} from 'ng-metasys/core';
import {Service} from 'ng-metasys/providers';
import {SomeService} from './app/some.service';

@Service
@Inject('$http')
export class SomeService {
  constructor($http) {}
}
```
It allows using injected data in the constructor. Equivalent code:
```javascript
angular.module('AppModule')
  .service('someService', ['$http', function SomeService($http) {}])
```

* Inject into methods:
```javascript
import {Inject} from 'ng-metasys/core';
import {Module, Config} from 'ng-metasys/module';

@Module()
export class AppModule {
  @Config
  @Inject('$q')
  config($q) {}
}
```
It allows injecting data into the class method. Usually this method is 
used by Angular as a function, and the other class parts are ignored.
Equivalent code: 
```javascript
angular.module('AppModule', [])
  .config(['$q', function config($q) {}])
```

### @Property
Property is used in components and directives as elements of `bindings`
and `scope` sections respectively. So, if you have following code:
```javascript
@Component({
  selector: 'my-some',
  template: '<div></div>'
})
export class SomeComponent {
  @Property('<') myProperty;
}
```
It is an equivalent to the following construction:
```javascript
angular.module('AppModule')
  .component('mySome', {
    template: '<div></div>',
    controller: function SomeComponent() {},
    bindings: {
      myProperty: '<'
    }
  });
```
For the `scope` block rules are equal considering the difference between
`scope` and `bindings`.

### @Transclude
Transclude allows including HTML code inside the component/directive host
tag to the resulting HTML template. To implement transclusion just add 
the `@Trasnsclude` mark to the component or directive and send to it
an object with transclusion rules described in 
[Angular NgTransclude](https://docs.angularjs.org/api/ng/directive/ngTransclude)
article.
```javascript
@Component({
  selector: 'my-some',
  template: `
    <div>
      <div ng-transclude="title"></div>
      <div ng-transclude="body"></div>
      <div ng-transclude="footer"></div>
    </div>
  `
})
@Transclude({
  title: '?paneTitle',
  body: 'paneBody',
  footer: '?paneFooter'
})
export class SomeComponent {
}
```
It is an equivalent to the following code:
```javascript
angular.module('AppModule')
  .component('mySome', {
    template: `
      <div>
        <div ng-transclude="title"></div>
        <div ng-transclude="body"></div>
        <div ng-transclude="footer"></div>
      </div>
    `,
    controller: function SomeComponent() {},
    transclude: {
      title: '?paneTitle',
      body: 'paneBody',
      footer: '?paneFooter'
    },
    bindings: {
      myProperty: '<'
    }
  });
```

## License
Information about license you can found [here](./LICENSE).