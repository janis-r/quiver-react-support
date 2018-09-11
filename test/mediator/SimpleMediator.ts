import {Injectable, Mediator} from "quiver-framework";
import {ComponentWithInjection} from "../component/staticInjector/ComponentWithInjection";

@Injectable()
export class SimpleMediator extends Mediator {

    static instance: SimpleMediator;

    state: "initialize" | "destroy" | undefined;

    constructor(public view: ComponentWithInjection) {
        super();
        SimpleMediator.instance = this;
    }

    initialize(): void {
        this.state = "initialize";
    }

    destroy(): void {
        this.state = "destroy";
    }

}