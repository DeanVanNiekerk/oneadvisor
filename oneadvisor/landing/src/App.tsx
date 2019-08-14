import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import ChangeLog from "./components/changeLog/ChangeLog";
import ContactUs from "./components/contact-us/ContactUs";
import Documentation from "./components/documentation/Documentation";
import Home from "./components/home/Home";

const App: React.FC = () => {
    return (
        <Router>
            <Route exact path={"/"} component={Home} />
            <Route exact path={"/contact-us"} component={ContactUs} />
            <Route exact path={"/documentation"} component={Documentation} />
            <Route exact path={"/change-log"} component={ChangeLog} />
        </Router>
    );
};

export default App;
