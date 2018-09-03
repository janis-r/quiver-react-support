This package is extending [Quiver framework](https://www.npmjs.com/package/quiver-framework) in order to bring out of the box support for [Dependency injection](https://en.wikipedia.org/wiki/Dependency_injection), View-models of [MVVM](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel) and event driven into **React**.

And here's how it works:
##Initialize application context

```js
const context = new ApplicationContext();

// Create service mapping that'll create new instance of a service for each consumer
context.injector.map(Service1);

// Create a singleton service - first instance created will be served to each following consumer
context.injector.map(Service2).asSingleton();

// Or we can split service interface from it's implementation, creating strong abstraction 
// between interface and implementation. Which would allow us to turn different service 
// implementation on and off with ease.
context.injector.map(Service3).toType(Service3DefaultImplementation);

// Or we can map anything to pre-fabricated value, like this:
context.injector.map(Service4).toValue(new Service4('with custom constructor args?'));

context.initialize();
```

Once that is done, accessing any of mapped values requires two steps:
```js
import * as React from "react"; // You still gonna need this as this is full fledged React component
import { Component } from "quiver-react-support"; // But you'll have to use this as super class
import { Inject } from "quiver-framework";
export class TestComponent extends Component <{}, {}> {

    /**
     * To inject anything there's only two things required:
     * - add data type to indicate dependency injection, and 
     * - add @Inject() decorator, so we know that this variable is expected to get its value from DI.
     */
    @Inject()
    readonly service: Service;
}
```
And that is it. We have set up, configured and access injected value.

