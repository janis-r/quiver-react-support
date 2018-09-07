import * as React from "react";
import { Component, ComponentType } from "react";
import { Injector, Type } from "quiver-framework";
import { InjectionDescriptor } from "Quiver-Framework/src/metadata/data/InjectionDescriptor";
import { getInjectionContext } from "./injectionContext";
import { prepareInjector } from "./util";

export function InjectionClient(...injectorConfig: (Type | InjectionDescriptor)[]) {
    return (ClientComponent: ComponentType): ComponentType => {
        class AdHoc extends Component {
            render() {
                const {Consumer, Provider} = getInjectionContext();
                return (
                    <Consumer>{
                        (injector: Injector) => {
                            const localInjector = prepareInjector(injector, injectorConfig);
                            const childComponent = localInjector.injectInto(<ClientComponent {... this.props} />);
                            return (
                                <Provider value={localInjector}>
                                    {childComponent}
                                </Provider>
                            );
                        }
                    }</Consumer>
                );
            }
        }
        return AdHoc;
    }
}