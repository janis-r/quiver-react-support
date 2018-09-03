import "reflect-metadata";
import * as React from "react";
import {suite, test} from "mocha-typescript";
import {expect} from "chai";
import * as Enzyme from "enzyme";
import {shallow, ShallowWrapper} from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import {Injector} from "quiver-framework";
import {StaticInjector, ApplicationContext} from "../src";
import {InjectedService1} from "./service/InjectedService1";
import {InjectedService2} from "./service/InjectedService2";
import {ComponentWithInjection} from "./component/ComponentWithInjection";
import {ComponentWithMissingInjection} from "./component/ComponentWithMissingInjection";
import {ComponentWithOptionalInjection} from "./component/ComponentWithOptionalInjection";

/**
 * Test if Component is able to receive values from injector
 */
@suite
export class TestInjections {

    static before() {
        Enzyme.configure({ adapter: new Adapter() });
    }

    private context: ApplicationContext;

    before(): void {
        delete StaticInjector['instance']; // This illustrates why singletons are evil - in perfect world this should never be done!
        this.context = new ApplicationContext();
        this.context.initialize();
    }

    private get injector(): Injector {
        return this.context.injector;
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

    @test("React component can request optional injections and nothing will err if such is not provided")
    optionalInjectionsWork() {
        this.injector.map(InjectedService1).asSingleton();

        const wrapper = shallow(<ComponentWithOptionalInjection />);
        expect(ComponentWithOptionalInjection.instance.service1, "Value of InjectedService1 is not available").to.be.instanceof(InjectedService1);
        expect(ComponentWithOptionalInjection.instance.service2, "Value of InjectedService2 is bogus").to.be.undefined;
        wrapper.unmount();
    }

    @test("React component can receive multiple injections")
    multipleInjectionsWork() {
        this.injector.map(InjectedService1).asSingleton();
        this.injector.map(InjectedService2).asSingleton();

        const wrapper = shallow(<ComponentWithOptionalInjection />);
        expect(ComponentWithOptionalInjection.instance.service1, "Value of InjectedService1 is not available").to.be.instanceof(InjectedService1);
        expect(ComponentWithOptionalInjection.instance.service2, "Value of InjectedService2 is not available").to.be.instanceof(InjectedService2);
        wrapper.unmount();
    }

}