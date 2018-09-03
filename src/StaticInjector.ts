import { ClassType, Injector } from "quiver-framework";

/**
 * Static provider of system injections which will be used as point of retrieval for system service injections.
 * (Or as a bridge between application context and React component)
 * @author Jānis Radiņš
 */
export class StaticInjector {

    private static instance: StaticInjector;

    /**
     * Get injection mapped by requested type
     * @param {ClassType<T>} type
     * @returns {T}
     */
    static get<T>(type: ClassType<T>): T {
        if (!StaticInjector.instance) {
            throw new Error('StaticInjector is not configured - no injector is set.');
        }
        return StaticInjector.instance.injector.get(type);
    }

    /**
     * System injector exposed
     * @returns {Injector}
     */
    static get injector(): Injector {
        return StaticInjector.instance.injector;
    }

    /**
     * Initialize instance
     * @param {Injector} injector
     */
    constructor(readonly injector: Injector) {
        if (StaticInjector.instance) {
            throw new Error('Singleton instance is already set!');
        }

        StaticInjector.instance = this;
    }

}