import "reflect-metadata";
import * as React from "react";
import {suite, test} from "mocha-typescript";
import {expect} from "chai";
import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import {shallow} from "enzyme";
import {Context, ContextLifecycleEvent, Injector, MediatorMap, WebApplicationContext} from "quiver-framework";
import {InjectedService1} from "./service/InjectedService1";
import {InjectedService2} from "./service/InjectedService2";
import {StaticInjector} from "../src/StaticInjector";
import {ComponentWithInjection} from "./component/ComponentWithInjection";
import {ComponentWithMissingInjection} from "./component/ComponentWithMissingInjection";
import {ShallowWrapper} from "enzyme";
import {SimpleMediator} from "./mediator/SimpleMediator";
import {ComponentWithOptionalInjection} from "./component/ComponentWithOptionalInjection";
import {ComponentThatTalksTooMuch} from "./component/ComponentThatTalksTooMuch";
import {MediatorThatHearsItAll} from "./mediator/MediatorThatHearsItAll";

@suite
export class Tests {

    static before() {
        Enzyme.configure({ adapter: new Adapter() });
    }

    private context: Context;
    private injector: Injector;

    before(): Promise<void> {

        this.context = new WebApplicationContext();
        this.injector = this.context.injector;

        delete StaticInjector['instance']; // This illustrates why singletons are evil - in perfect world this should never be done!
        new StaticInjector(this.injector);

        return new Promise<void>(
            resolve => {
                this.context.listenOnce(ContextLifecycleEvent.POST_INITIALIZE, () => resolve());
                this.context.initialize();
            }
        );
    }

    @test("React component can receive injections")
    injectionsAvailable() {
        this.injector.map(InjectedService1).asSingleton();
        const wrapper = shallow(<ComponentWithInjection />);
        expect(ComponentWithInjection.instance.service1, "Value of InjectedService1 is not available").to.be.instanceof(InjectedService1);
        wrapper.unmount();
    }

    @test("React component will produce error on missing injection")
    missingInjectionWillProduceError() {
        let wrapper: ShallowWrapper;
        expect(
            () => {
                wrapper = shallow(<ComponentWithMissingInjection />);
                wrapper.unmount();
            },
            "Requiring missing injection should throw error"
        ).to.throw(Error);
    }

    @test("React component can receive multiple and even optional injections")
    multipleAndOptionalInjectionsWork() {
        this.injector.map(InjectedService1).asSingleton();
        let wrapper = shallow(<ComponentWithOptionalInjection />);
        expect(ComponentWithOptionalInjection.instance.service1, "Value of InjectedService1 is not available").to.be.instanceof(InjectedService1);
        expect(ComponentWithOptionalInjection.instance.service2, "Value of InjectedService2 is not available but no error is produced as it's optional").to.be.undefined;

        wrapper.unmount();

        this.injector.map(InjectedService2).asSingleton();

        wrapper = shallow(<ComponentWithOptionalInjection />);
        expect(ComponentWithOptionalInjection.instance.service1, "Value of InjectedService1 is not available").to.be.instanceof(InjectedService1);
        expect(ComponentWithOptionalInjection.instance.service2, "Value of InjectedService2 is not available").to.be.instanceof(InjectedService2);
        wrapper.unmount();
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

        const mediatorMap = this.injector.get(MediatorMap);
        mediatorMap.map(ComponentThatTalksTooMuch, MediatorThatHearsItAll);

        const wrapper = shallow(<ComponentThatTalksTooMuch />);

        expect(ComponentThatTalksTooMuch.instance.eventsDelivered, "Component must be able to deliver it's messages to mediator").to.be.equal(MediatorThatHearsItAll.instance.eventsReceived);

    }

}