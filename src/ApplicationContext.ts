import {WebApplicationContext} from "quiver-framework";
import {MasterInjector} from "./MasterInjector";

/**
 * Default application context to be used with React.
 * It inherit from WebApplicationContext so all required extensions will be in place.
 * Afterwards, default application Injector will be passed to MasterInjector and Component
 * class will be able to reach it.
 */
export class ApplicationContext extends WebApplicationContext {

    /**
     * Create new  React application context
     * @param modules A list of app modules to enable in context
     */
    constructor(... modules: any[]) {
        super();
        this.configure(...modules);
        MasterInjector.reset(this.injector);
        this.initialize();
    }
}