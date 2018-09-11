import * as React from "react";
import {Type} from "quiver-framework";
import {InjectionDescriptor} from "quiver-framework/src/metadata/data/InjectionDescriptor";
import {ContextInjection} from "../ContextInjection";
import {applyInjectorMapping} from "quiver-framework/src/util/injector-util";

type Injection = Type | InjectionDescriptor;

export const ClientOnlyInject = (... config: Injection[]) => Component => {
    return (props, state) => {
        const instance = new Component(props, state);
        const oldRender = instance.render;

        const {Consumer, Provider} = ContextInjection;

        console.log('>> oldRender', oldRender);
        instance.render = function () {
            return (
                <Consumer>{parentInjector => {
                    console.log(parentInjector);

                    const injector = parentInjector.createSubInjector();
                    if (config) {
                        const toInstantiate: Type[] = [];
                        config.forEach(entry => toInstantiate.push(... applyInjectorMapping(entry, injector)))
                    }

                    injector.injectInto(this);
                    return (
                        <Provider value={injector}>
                            <div style={{backgroundColor: "red", textAlign: "center"}}>{oldRender.call(instance)}</div>;
                        </Provider>
                    )
                }}
                </Consumer>
            );
        };
        return instance;
    };
    return Component;
};
