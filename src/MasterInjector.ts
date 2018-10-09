import {ClassType, Injector} from "quiver-framework";

/**
 * Master injector of current application scope.
 * @author Jānis Radiņš
 */
export class MasterInjector {

    private static _injector: Injector;

    /**
     * Get injection mapped by requested type
     * @param {ClassType<T>} type
     * @returns {T}
     */
    static get<T>(type: ClassType<T>): T {
        const {_injector: injector} = MasterInjector;
        if (!injector) {
            throw new Error("StaticInjector is not configured - no injector is set.");
        }
        return injector.get(type);
    }

    /**
     * Check if master injector is configured and ready to provide service
     * @returns {boolean}
     */
    static get configured():  boolean {
        return !!MasterInjector._injector;
    }

    /**
     * System injector exposed
     * @returns {Injector}
     */
    static get injector(): Injector {
        const {_injector: injector} = MasterInjector;
        if (!injector) {
            throw new Error("StaticInjector is not configured - no injector is set.");
        }
        return injector;
    }

    /**
     * Reset master injector to new value
     * @param {Injector} injector
     */
    static reset(injector: Injector): void {
        MasterInjector._injector = injector;
    }

    private constructor() {
        throw new Error("This class should have no instance!");
    }

}