import * as React from "react";
import {ComponentType, ReactNode} from "react";
import { Injector, MediatorMap, Type } from "quiver-framework";
import { InjectionDescriptor } from "quiver-framework/src/metadata/data/InjectionDescriptor";
import { applyInjectorMapping } from "quiver-framework/src/util/injector-util";
import { getInjectionContext } from "../ContextInjection";

export type ClientDecorator<TProps extends object = {}> = <TComponent extends React.ComponentType<TProps>>(component: TComponent) => TComponent;

type InjectionConfig = Type | InjectionDescriptor;
export const Client = (...injectorConfig: InjectionConfig[]): ClientDecorator =>
    (Component) => {
        console.log('>> Client input: ', (Component + "").substr(0, 50));

        class AdHoc extends React.Component<P> {

            private injector: Injector;
            // private mediatorMap: MediatorMap;
            // private component: ReactNode;

            render() {

                const { Consumer, Provider } = getInjectionContext();
                console.log('>> Client:render', <Consumer>{value => <div>{value['MASTER_SEAL_KEY']}</div>}</Consumer>);
                // console.log(Consumer);

                return (
                    <>
                        <Consumer>{value => {
                            console.error('> value', value);
                            // throw new Error(value+"");
                            console.log('Consumer', value['MASTER_SEAL_KEY']);

                            return <div>{value['MASTER_SEAL_KEY']}</div>;
                        }}</Consumer>
                        <Component {... this.props} />
                    </>);

                /*return (
                    <Consumer>{
                        (parentInjector: Injector) => {
                            console.log('>> parentInjector', parentInjector);

                            this.prepareInjector(parentInjector);
                            this.component = this.injector.injectInto(<Component {... this.props} />);
                            return (
                                <Provider value={this.injector}>{this.component}</Provider>
                            );
                        }
                    }</Consumer>
                );*/
            }

            /*componentDidMount(): void {
                if (this.injector.hasMapping(MediatorMap)) {
                    this.mediatorMap = this.injector.get(MediatorMap);
                    this.mediatorMap.mediate(this.component);
                }
            }

            componentWillUnmount() {
                if (this.mediatorMap) {
                    this.mediatorMap.unMediate(this.component);
                    this.mediatorMap = null;
                }
            }*/

            private prepareInjector(parentInjector: Injector): Injector {
                this.injector = parentInjector.createSubInjector();
                if (injectorConfig && injectorConfig.length) {
                    injectorConfig.forEach(mapping =>
                        applyInjectorMapping(mapping, this.injector).forEach(type => this.injector.get(type))
                    );
                }
                return this.injector;
            }
        }
        return AdHoc as ComponentType<P>;
    }
