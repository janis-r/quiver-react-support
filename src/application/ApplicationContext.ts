import {WebApplicationContext} from "quiver-framework";
import {MasterInjector} from "../MasterInjector";
import {ApplicationStateEvent} from "./ApplicationStateEvent";

/**
 * Default application context to be used with React.
 * It inherit from WebApplicationContext so all required extensions will be in place.
 * Afterwards, default application Injector will be passed to MasterInjector and Component
 * class will be able to reach it.
 */
export class ApplicationContext extends WebApplicationContext {
    private initializationTimeout: number | undefined;

    /**
     * Create new React application context
     * @param modules A list of app modules to enable in context
     */
    constructor(... modules: any[]) {
        super();
        this.configure(...modules);
        MasterInjector.reset(this.injector);

        this.initializationTimeout = setTimeout(() => this.initialize());
    }

    /**
     * Initialize context.
     * This method will be auto invoked within shortest timeout after Context is created, created to let finish
     * configuration before, we're really initializing.
     * Also, some might want to get to know when exactly context is Configured and Initialized and if so, it would
     * alright to invoke this method manually and get notified via Promise and that even won't make a double call
     * to this method.
     * @returns {Promise<void>}
     */
    async initialize(): Promise<void> {
        super.initialize();

        if (this.initializationTimeout) {
            clearTimeout(this.initializationTimeout);
            this.initializationTimeout = undefined;
        }

        const configureEvent = new ApplicationStateEvent(ApplicationStateEvent.CONFIGURE);
        this.injector.dispatchEvent(configureEvent);
        await configureEvent.stateIsComplete();

        const initializedEvent = new ApplicationStateEvent(ApplicationStateEvent.INITIALIZED);
        this.injector.dispatchEvent(initializedEvent);
        await initializedEvent.stateIsComplete();
    }
}