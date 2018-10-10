import {Event} from "quiver-framework";

/**
 * Application state event used to synchronize initialization stages across application.
 * Also traversing from one stage to another can be postponed by adding promise to await for list.
 * @author Jānis Radiņš
 */
export class ApplicationStateEvent extends Event {
    /**
     * Dispatched as application configuration is done but actual functionality is still not launched and
     * indicates last moment to apply any configuration to be done before we're taking off
     * @type {string}
     */
    static readonly CONFIGURE = "configure";

    /**
     * Indicates that application initialization is complete and it's launched
     * @type {string}
     */
    static readonly INITIALIZED = "initialized";

    private awaitPromises: Promise<void>[] = [];

    /**
     * Add to list of promises which should be awaited for, before application can move to next state.
     * @param {Promise<void>} promise
     */
    awaitFor(promise: Promise<void>): void {
        this.awaitPromises.push(promise);
    }

    /**
     * Check if application state event has got some unresolved promises that permit traversing to next state
     * @returns {Promise<void>}
     */
    async stateIsComplete(): Promise<void> {
        await Promise.all(this.awaitPromises);
    }

}