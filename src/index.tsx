import "reflect-metadata";

import * as React from "react";
import {render} from "react-dom";
import {ComponentWithInjection} from "./comp/ComponentWithInjection";

// export * from "./Component";
// export * from "./ApplicationContext";
// export * from "./StaticInjector";

render(<ComponentWithInjection>
    <div>---</div>
</ComponentWithInjection>, document.getElementById('root'));