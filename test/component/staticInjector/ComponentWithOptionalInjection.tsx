import { Inject, Optional } from "quiver-framework";
import * as React from "react";
import { Component } from "../../../src/index";
import { InjectedService1 } from "../../service/InjectedService1";
import { InjectedService2 } from "../../service/InjectedService2";

export class ComponentWithOptionalInjection extends Component {

    public static instance: ComponentWithOptionalInjection;

    @Inject()
    public service1: InjectedService1;

    @Inject()
    @Optional()
    public service2: InjectedService2;

    constructor(props:any) {
        super(props);
        ComponentWithOptionalInjection.instance = this;
    }

    render () {
        return <div>Foo bar lee!</div>
    }
}