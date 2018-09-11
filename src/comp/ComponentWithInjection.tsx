import * as React from "react";
import {Inject} from "quiver-framework";
import {InjectedService1} from "../service/InjectedService1";
import {ClientOnlyInject} from "../decorator/ClientOnlyInject";

@ClientOnlyInject(
    InjectedService1
)
export class ComponentWithInjection extends React.Component<{}, {}> {

    @Inject()
    private service1: InjectedService1;

    render () {
        const {
            props: { children }
        } = this;
        return (
            <div>
                Foo bar lee! <span>SPAN</span> <b>ssssssssss</b>
                <div>Service1 name: {this.service1.name}</div>
                {children}
            </div>
        );
    }
}