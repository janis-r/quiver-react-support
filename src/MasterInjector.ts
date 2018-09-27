import {ClassType, Injector} from "quiver-framework";

/**
 * Master injector of current application scope.
 * @author Jānis Radiņš
 */
export class MasterInjector {

    private static instance: MasterInjector;

    /**
     * Check if master injector is configured and ready to provide service
     * @returns {boolean}
     */
    static get configured():  boolean {
        return !!MasterInjector.instance;
    }

    /**
     * Get injection mapped by requested type
     * @param {ClassType<T>} type
     * @returns {T}
     */
    static get<T>(type: ClassType<T>): T {
        if (!MasterInjector.instance) {
            throw new Error('StaticInjector is not configured - no injector is set.');
        }
        return MasterInjector.instance.injector.get(type);
    }

    /**
     * System injector exposed
     * @returns {Injector}
     */
    static get injector(): Injector {
        return MasterInjector.instance.injector;
    }

    /**
     * Reset master injector to new value
     * @param {Injector} injector
     */
    static reset(injector: Injector): void {
        if (!MasterInjector.instance) {
            new MasterInjector(injector);
        } else {
            MasterInjector.instance.injector = injector;
        }
    }

    /**
     * Initialize instance
     * @param {Injector} injector Default master injector value
     */
    constructor(private injector: Injector) {
        if (MasterInjector.instance) {
            throw new Error('Singleton instance is already set!');
        }

        MasterInjector.instance = this;
    }

}