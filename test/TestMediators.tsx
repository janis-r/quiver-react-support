import "reflect-metadata";
import * as React from "react";
import {suite, test} from "mocha-typescript";
import {expect} from "chai";
import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import {shallow} from "enzyme";
import {ContextLifecycleEvent, Injector, MediatorMap, WebApplicationContext} from "quiver-framework";
import {StaticInjector} from "../src";
import {ComponentThatTalksTooMuch} from "./component/ComponentThatTalksTooMuch";
import {ComponentWithInjection} from "./component/ComponentWithInjection";
import {MediatorThatHearsItAll} from "./mediator/MediatorThatHearsItAll";
import {SimpleMediator} from "./mediator/SimpleMediator";
import {InjectedService1} from "./service/InjectedService1";

/**
 * Test if mediators are created for component and they can actually talk to each other
 */
@suite
export class TestMediators {

    static before() {
        Enzyme.configure({ adapter: new Adapter() });
    }

    private injector: Injector;

    before(): Promise<void> {

        const context = new WebApplicationContext();
        this.injector = context.injector;

        delete StaticInjector['instance']; // This illustrates why singletons are evil - in perfect world this should never be done!
        new StaticInjector(this.injector);

        return new Promise<void>(
            resolve => {
                context.listenOnce(ContextLifecycleEvent.POST_INITIALIZE, () => resolve());
                context.initialize();
            }
        );
    }

    @test("React component will receive mediator and it will actually work")
    willReceiveMediator() {
        this.injector.map(InjectedService1).asSingleton();

        const mediatorMap = this.injector.get(MediatorMap);
        mediatorMap.map(ComponentWithInjection, SimpleMediator);

        const wrapper = shallow(<ComponentWithInjection />);
        expect(mediatorMap.hasMediators(ComponentWithInjection.instance), "Mediator must be created").to.be.true;
        expect(SimpleMediator.instance, "Mediator instance is initialized").to.be.instanceof(SimpleMediator);
        expect(SimpleMediator.instance.view, "View is injected into mediator").to.be.instanceof(ComponentWithInjection);
        expect(SimpleMediator.instance.state, "Mediator is in initialized state").to.be.equal("initialize");
        wrapper.unmount();

        expect(SimpleMediator.instance.state, "Mediator instance is destroyed").to.be.equal("destroy");
    }

    @test("React component can deliver notifications to mediator")
    canCommunicateToMediator() {
        this.injector.get(MediatorMap).map(ComponentThatTalksTooMuch, MediatorThatHearsItAll);

        const wrapper = shallow(<ComponentThatTalksTooMuch />);
        expect(
            ComponentThatTalksTooMuch.instance.eventsDelivered,
            "Component must be able to deliver it's messages to mediator"
        ).to.be.equal(MediatorThatHearsItAll.instance.eventsReceived);
        wrapper.unmount();
    }

}