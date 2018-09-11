import { WebApplicationContext } from "quiver-framework";
import {configureInjector} from "./ContextInjection";
import {StaticInjector} from "./StaticInjector";

/**
 * Default application context to be used with React applications.
 * It will inherit from WebApplicationContext so all required extentions will be in place.
 * Afterwards, default application Injector will be passed to StaticInjector and Component 
 * class will be able to reach it.
 */
export class ApplicationContext extends WebApplicationContext {

    constructor() {
        super();
        // console.log('ApplicationContext injector:', this.injector["mappings"].size, this.injector["MASTER_SEAL_KEY"])
        configureInjector(this.injector);
        new StaticInjector(this.injector);
    }
}