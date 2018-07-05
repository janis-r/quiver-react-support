import * as React from "react";
import {Event, Inject} from "quiver-framework";
import {Component} from "../../src/Component";
import {InjectedService1} from "../service/InjectedService1";

export class ComponentThatTalksTooMuch extends Component {

    public static instance: ComponentThatTalksTooMuch;

    public eventsDelivered: number = 0;

    constructor(props:any) {
        super(props);
        ComponentThatTalksTooMuch.instance = this;
    }

    render () {

        this.dispatchEvent(EventType.First);
        this.eventsDelivered ++;

        this.dispatchEvent(EventType.Second, 'Wild, untyped data');
        this.eventsDelivered ++;

        this.dispatchEvent(new Event(EventType.Third, 'Wild, untyped data'));
        this.eventsDelivered ++;

        return <div>Foo bar lee!</div>
    }
}

export enum EventType {
    First = "first",
    Second = "second",
    Third = "third",}