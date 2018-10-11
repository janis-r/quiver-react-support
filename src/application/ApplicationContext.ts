import {EventDispatcher, WebApplicationContext} from "quiver-framework";
import {MasterInjector} from "../MasterInjector";
import {ApplicationStateEvent} from "./ApplicationStateEvent";

/**
 * Default application context to be used with React.
 * It inherit from WebApplicationContext so all required extensions will be in place.
 * Afterwards, default application Injector will be passed to MasterInjector and Component
 * class will be able to reach it.
 */
export class ApplicationContext extends WebApplicationContext {
    private configureTimeout: number | undefined;

    /**
     * Create new React application context
     * @param modules A list of app modules to enable in context
     */
    constructor(... modules: any[]) {
        super();
        this.configure(...modules);
        super.initialize();

        MasterInjector.reset(this.injector);
        this.configureTimeout = setTimeout(() => this.configureApp());
    }

    /**
     * Launch application configuration notifications.
     * This method will be auto invoked within shortest timeout after Context is created to notify user defined modules
     * on when it's right time to do configuration and when we can be sure that configuration is done.
     * Also, some might want to get to know when exactly app is Configured and Initialized and if so, it would be
     * alright to invoke this method manually and get notified via Promise.
     * @returns {Promise<void>}
     */
    async configureApp(): Promise<void> {
        if (this.configureTimeout) {
            clearTimeout(this.configureTimeout);
            this.configureTimeout = undefined;
        }

        const eventDispatcher = this.injector.get(EventDispatcher);

        const prepareEvent = new ApplicationStateEvent(ApplicationStateEvent.PREPARE);
        eventDispatcher.dispatchEvent(prepareEvent);
        await prepareEvent.stateIsComplete();

        const configureEvent = new ApplicationStateEvent(ApplicationStateEvent.CONFIGURE);
        eventDispatcher.dispatchEvent(configureEvent);
        await configureEvent.stateIsComplete();

        const initializedEvent = new ApplicationStateEvent(ApplicationStateEvent.INITIALIZED);
        eventDispatcher.dispatchEvent(initializedEvent);
        await initializedEvent.stateIsComplete();
    }
}