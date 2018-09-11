import * as React from "react";
import {Inject} from "quiver-framework";
import {InjectedService1} from "../../service/InjectedService1";
import {Client} from "../../../src/decorator/Client";

@Client()
export class ComponentWithInjection extends React.Component<{}, {}> {

    // public static instance: ComponentWithInjection;

    // @Inject()
    // public service1: InjectedService1;

    constructor(props:any) {
        super(props);
        console.log('>> ComponentWithInjection:constructor');
        // ComponentWithInjection.instance = this;
    }

    render () {
        return <div>Foo bar lee!</div>
    }
}