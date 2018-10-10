# React support package for Quiver framework

Extending [Quiver framework](https://www.npmjs.com/package/quiver-framework) in order to bring support for 
[Dependency injection](https://en.wikipedia.org/wiki/Dependency_injection), [View-models](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel) of 
MVVM and event driven architecture into 
[React](https://reactjs.org).

### How to use Injector

Configure application context:

```javascript
import {ApplicationContext} from "quiver-react-support";

const {injector} = new ApplicationContext(/*List of app modules, if any go here*/);
/**
 * Create service mapping that'll create new instance of a service for each consumer
 */
injector.map(SomeService);
/**
 * Create a singleton service - first instance created will be served to each following consumer
 */
injector.map(SomeService).asSingleton();
/**
 * Or we can split service interface from it's implementation, creating strong abstraction 
 * between interface and implementation.
 */
injector.map(AbstractService).toType(AbstractServiceImplementation);
/**
 * Or we can map anything to pre-fabricated value, like this:
 */
injector.map(SomeService).toValue({foo: 1, bar: 2, lee: 3});
```

Access injected values from React component:
```javascript
import {Component, Inject} from "quiver-react-support";

export class DisplayComponent extends Component {
    
    @Inject()
    private service: SomeService;
    
    render() {
        return `SomeService is accessible like: ${this.service}`;
    }
    
}
```