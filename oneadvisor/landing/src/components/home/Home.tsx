import React from "react";

import Navbar from "@/components/layout/Navbar";

import Footer from "../layout/Footer";
import ChangeLog from "./ChangeLog";
import Jumbotron from "./Jumbotron";
import Modules from "./Modules";
import Partners from "./Partners";
import RequestDemo from "./RequestDemo";
import Team from "./Team";

const Home: React.FC = () => {
    return (
        <>
            <Navbar />
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
