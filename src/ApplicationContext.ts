import { ContextLifecycleEvent, WebApplicationContext } from "quiver-framework";
import { StaticInjector } from "./StaticInjector";
/**
 * Default application context to be used with React applications.
 * It will inherit from WebApplicationContext so all required extentions will be in place.
 * Afterwards, default application Injector will be passed to StaticInjector and Component 
 * class will be able to reach it.
 */
export class ApplicationContext extends WebApplicationContext {

    constructor() {
        super();
        new StaticInjector(this.injector);
    }
}