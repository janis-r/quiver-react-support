import * as React from "react";
import {ComponentType} from "react";
import {Injector} from "quiver-framework";
import {MasterInjector} from "../MasterInjector";

/**
 * Redux style decorator function that can deliver props from master Injector to React.Component instance
 * @param {React.ComponentType<TInjectedProps & TNeedsProps>} component
 * @returns {(injectorToProps?: (injector: Injector) => TInjectedProps) => React.ComponentType<TNeedsProps>}
 */
export const withMasterInjections = <TInjectedProps, TNeedsProps>(component: ComponentType<TInjectedProps & TNeedsProps>) =>
    (injectorToProps: (injector: Injector) => TInjectedProps): ComponentType<TNeedsProps> =>
        class AdHoc extends React.Component<TNeedsProps, {}> {
            render() {
                const componentProps = {... this.props as any};
                if (injectorToProps) {
                    const injectedProps = injectorToProps(MasterInjector.injector);
                    Object.keys(injectedProps).forEach(key => componentProps[key] = injectedProps[key]);
                }
                return React.createElement(component, componentProps);
            }
        };