import * as React from "react";
import {EventDispatcher, MediatorMap, Event, EventListener, EventMapping, Inject, Optional} from "quiver-framework";
import {MasterInjector} from "./MasterInjector";

/**
 * Base class for any React component that should be part of Quiver framework and receive injections and be part
 * of mediator mappings.
 * (This component is proper implementation of EventDispatcher implemented by composition so it can communicate
 * with Mediator instances.)
 * @author Jānis Radiņš
 */
export abstract class Component<P = any, S = any> extends React.Component<P, S> {

    @Inject()
    @Optional()
    private __mediatorMap: MediatorMap;

    private __eventDispatcher = new EventDispatcher();

    constructor(props: P, context?: any) {
        super(props, context);
        MasterInjector.injector.injectInto(this);
    }

    /**
     * Create any mediators for this component, if any, as  component is mounted.
     */
    componentWillMount() {
        if (this.__mediatorMap) {
            this.__mediatorMap.mediate(this);
        }
    }

    /**
     * Remove mediators and event listeners of a component as it's unmounted.
     */
    componentWillUnmount(): void {
        if (this.__mediatorMap) {
            this.__mediatorMap.unMediate(this);
        }
        this.__eventDispatcher.removeAllEventListeners();
    }

    /**
     * Add event listener.
     * @param {string} event Event name for which to listen to
     * @param {EventListener} listener Listener function that will be invoked as event with specified name is dispatched.
     * @param {Object} scope Listener scope which will be applied as listener is invoked. (You can leave it undefined,
     * if you don't care about scope that much).
     * @returns {EventMapping} Null in case if event name is already mapped to same function. Or EventMapping object
     * which is to be used in order to set some of mapping properties like <code>once()</code> which will make listener
     * to be executed upon first event dispatch and then be gone.
     */
    addEventListener(event: string, listener: EventListener, scope?: Object): EventMapping {
        return this.__eventDispatcher.addEventListener(event, listener, scope);
    }

    /**
     * Add event listener and remove it just after first event of type will be fired.
     * @param {string} event Event name for which to listen to.
     * @param {EventListener} listener Listener function that will be invoked as event with specified name is dispatched.
     * @param {Object} scope Listener scope which will be applied as listener is invoked. (You can leave it undefined,
     * if you don't care about scope that much).
     * @returns {EventMapping} Null in case if event name is already mapped to same function. Or EventMapping object
     * which is to be used in order to set some of mapping properties like <code>once()</code> which will make listener
     * to be executed upon first event dispatch and then be gone.
     */
    listenOnce(event: string, listener: EventListener, scope?: Object): EventMapping {
        return this.__eventDispatcher.listenOnce(event, listener, scope);
    }

    /**
     * Check if event dispatcher has mapping of certain event to listener.
     * @param {string} event Target event name.
     * @param {EventListener} listener Listener function.
     * @param {Object} scope Listener scope which will be applied as listener is invoked.
     * @returns {boolean} true if event mapping is found and false otherwise
     */
    hasEventListener(event: string, listener?: EventListener, scope?: Object): boolean {
        return this.__eventDispatcher.hasEventListener(event, listener, scope);
    }

    /**
     * Remove event listener.
     * @param {string} event Target event name.
     * @param {EventListener} listener Listener function.
     * @param {Object} scope Listener scope which will be applied as listener is invoked.
     * @returns {boolean} True if event name binding to listener function was found or false if it was found not.
     */
    removeEventListener(event: string, listener: EventListener, scope?: Object): boolean {
        return this.__eventDispatcher.removeEventListener(event, listener, scope);
    }

    /**
     * Remove all listeners of a particular event from all scopes or the specified scope.
     * @param {string} eventType Event name to be unmapped from all listeners.
     * @param {Object} scope Listener scope from which all listeners mapped to eventType will be removed.
     * @returns {boolean} True if any of mappings have been found; false otherwise.
     */
    removeEventListeners(eventType: string, scope?: Object): boolean {
        return this.__eventDispatcher.removeEventListeners(eventType, scope);
    }

    /**
     * Remove all listeners registered with specified scope or with the whole dispatcher instance.
     * @param {Object} scope Scope from which all listeners mapped listeners will be removed. If not specified,
     * all listeners will be removed from whole dispatcher instance.
     * @returns {boolean} True if any listeners to remove where found; false otherwise.
     */
    removeAllEventListeners(scope?: Object): boolean {
        return this.__eventDispatcher.removeAllEventListeners(scope);
    }

    /**
     * Dispatch event object to all subscribed listeners.
     * @param {Event} event Event object that defines event type and data
     * @returns {boolean} True if default action of event has not been prevented in any of its listeners.
     */
    dispatchEvent(event: Event): boolean;

    /**
     * Dispatch event notification by separate type and data arguments.
     * @param {string} eventType Event type to be dispatched.
     * @param eventData Arbitrary data to ship along with event dispatch.
     * @returns {boolean} True if default action of event has not been prevented in any of its listeners
     */
    dispatchEvent(eventType: string, eventData?: any): boolean;
    dispatchEvent(eventTypeOrEvent: Event | string, eventData?: any): boolean {
        return this.__eventDispatcher.dispatchEvent(
            eventTypeOrEvent instanceof Event ? eventTypeOrEvent : new Event(eventTypeOrEvent, eventData)
        );
    }

}