import { Event } from "quiver-framework";
import * as React from "react";
import { Component } from "../../src";

export class ComponentThatTalksTooMuch extends Component {

    public static instance: ComponentThatTalksTooMuch;

    public eventsDelivered: number = 0;

    constructor(props: any) {
        super(props);
        ComponentThatTalksTooMuch.instance = this;
    }

    render() {

        this.dispatchEvent(EventType.First);
        this.eventsDelivered++;

        this.dispatchEvent(EventType.Second, 'Wild, untyped data');
        this.eventsDelivered++;

        this.dispatchEvent(new Event(EventType.Third, 'Wild, untyped data'));
        this.eventsDelivered++;

        return <div>Foo bar lee!</div>
    }
}

export enum EventType {
    First = "first",
    Second = "second",
    Third = "third"
}