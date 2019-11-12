import React from "react";

import Routes from "./routes/Routes";
import Startup from "./Startup";

const App: React.FC = () => (
    <Startup>
        <Routes />
    </Startup>
);

export default App;
