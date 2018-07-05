import * as React from "react";
import {Inject} from "quiver-framework";
import {Component} from "../../src/Component";
import {InjectedService1} from "../service/InjectedService1";

export class ComponentWithInjection extends Component {

    public static instance: ComponentWithInjection;

    @Inject()
    public service1: InjectedService1;

    constructor(props:any) {
        super(props);
        ComponentWithInjection.instance = this;
    }

    render () {
        return <div>Foo bar lee!</div>
    }
}