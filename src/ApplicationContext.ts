import {WebApplicationContext} from "quiver-framework";
import {MasterInjector} from "./MasterInjector";

/**
 * Default application context to be used with React.
 * It inherit from WebApplicationContext so all required extensions will be in place.
 * Afterwards, default application Injector will be passed to MasterInjector and Component
 * class will be able to reach it.
 */
export class ApplicationContext extends WebApplicationContext {

    constructor() {
        super();
        MasterInjector.reset(this.injector);
        this.initialize();
    }
}