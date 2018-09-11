import { Inject } from "quiver-framework";
import * as React from "react";
import { Component } from "../../../src/index";
import { InjectedService2 } from "../../service/InjectedService2";

export class ComponentWithMissingInjection extends Component {

    public static instance: ComponentWithMissingInjection;

    @Inject()
    public service: InjectedService2;

    constructor(props:any) {
        super(props);

        console.log('----', this.service)

        ComponentWithMissingInjection.instance = this;
    }

    render () {
        return <div>Foo bar lee!</div>
    }
}