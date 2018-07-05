import {Event, EventListener, Injectable, Mediator} from "quiver-framework";
import {ComponentThatTalksTooMuch, EventType} from "../component/ComponentThatTalksTooMuch";

@Injectable()
export class MediatorThatHearsItAll extends Mediator {

    static instance: MediatorThatHearsItAll;

    public eventsReceived: number = 0;

    constructor(public view: ComponentThatTalksTooMuch) {
        super();
        MediatorThatHearsItAll.instance = this;
    }

    initialize(): void {
        this.view.listenOnce(EventType.First, this.eventListener);
        this.view.addEventListener(EventType.Second, this.eventListener);
        this.view.addEventListener(EventType.Third, this.eventListener);
    }

    private eventListener: EventListener = (event: Event) => this.eventsReceived++;

}