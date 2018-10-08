import * as React from "react";
import {ComponentType, ReactElement} from "react";
import {Injector} from "quiver-framework";
import {MasterInjector} from "../MasterInjector";

export const withMasterInjections = <P extends object>(component: ComponentType<P>) => (injectorToProps?: InjectorToProps) => (props): ReactElement<P> => {
    const componentProps = {... props};
    if (injectorToProps) {
        const injectedProps = injectorToProps(MasterInjector.injector);
        Object.keys(injectedProps).forEach(key => componentProps[key] = injectedProps[key]);
    }
    return React.createElement(component, componentProps);
};

export type InjectorToProps = (injector: Injector) => {};