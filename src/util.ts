import { Injector, Type } from "quiver-framework";
import { InjectionDescriptor } from "Quiver-Framework/src/metadata/data/InjectionDescriptor";

export const prepareInjector = (injector: Injector, mappings: (Type | InjectionDescriptor)[]): Injector => {
    if (!mappings || !mappings.length) {
        return injector;
    }

    const toInstantiate: Type[] = [];
    injector = injector.createSubInjector();

    mappings.forEach(
        mapping => toInstantiate.push(...this.prepareMapping(mapping))
    );

    toInstantiate.forEach(type => injector.getMapping(type));

    return injector;
};


const prepareMapping = (mapping: Type | InjectionDescriptor, injector: Injector): Type[] => {
    const injectionsToInstantiate: Type[] = [];

    // We have got a singular entry and such are to be mapped as singletons
    if ("map" in mapping === false) {
        const mappedType = mapping as Type;
        if (injector.hasDirectMapping(mappedType)) {
            injector.unMap(mappedType);
        }
        injector.map(<Type>mapping).asSingleton();
    } else {
        const injection = mapping as InjectionDescriptor;
        if (typeof injection.map !== "function") {
            throw new Error("Injection mapping doesn't seem to be a valid object type");
        }

        const injectionMapping = injector.map(injection.map);
        if (injection.useExisting) {
            // if use existing is set create forward reference and ignore the rest
            injectionMapping.toExisting(injection.useExisting);
        } else if (injection.useValue) {
            // Look for use value as next one
            injectionMapping.toValue(injection.useValue);
        } else if (injection.useType) {
            // If use type is set map injection to type or to singleton in case if asSingleton is present
            if ("asSingleton" in injection && !injection.asSingleton) {
                injectionMapping.toType(injection.useType);
            } else {
                injectionMapping.toSingleton(injection.useType);
            }
        } else if (injectionMapping.asSingleton) {
            //If everything else fails make mapping as singleton
            injectionMapping.asSingleton();
        }
        if (injection.instantiate && injectionsToInstantiate.indexOf(injection.map) === -1) {
            injectionsToInstantiate.push(injection.map);
        }
    }
    return injectionsToInstantiate;
};