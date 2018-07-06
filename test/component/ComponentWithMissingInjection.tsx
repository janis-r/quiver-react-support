import * as React from "react";
import {Inject} from "quiver-framework";
import {Component} from "../../src";
import {InjectedService2} from "../service/InjectedService2";

export class ComponentWithMissingInjection extends Component {

    public static instance: ComponentWithMissingInjection;

    @Inject()
    public service: InjectedService2;

    constructor(props:any) {
        super(props);
        ComponentWithMissingInjection.instance = this;
    }

    render () {
        return <div>Foo bar lee!</div>
    }
}