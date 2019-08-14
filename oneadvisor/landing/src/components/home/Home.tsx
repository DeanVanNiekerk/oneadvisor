import React from "react";

import ChangeLog from "./ChangeLog";
import Footer from "./Footer";
import Jumbotron from "./Jumbotron";
import Modules from "./Modules";
import Partners from "./Partners";
import RequestDemo from "./RequestDemo";
import Team from "./Team";

const Home: React.FC = () => {
    return (
        <>
            <Jumbotron />
            <Modules />
            <Team />
            <ChangeLog />
            <Partners />
            <RequestDemo />
            <Footer />
        </>
    );
};

export default Home;
