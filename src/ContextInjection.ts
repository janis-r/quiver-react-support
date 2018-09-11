import * as React from "react";
import { Context } from "react";
import { Injector } from "quiver-framework";

let context: Context<Injector>;

export const configureInjector = (injector: Injector): void => {

    console.log(">> configureInjector", injector['MASTER_SEAL_KEY'])

    if (context) {
        throw new Error("Master injector can be configured only once!");
    }
    context = React.createContext(injector);
};

export const ContextInjection = React.createContext(new Injector());