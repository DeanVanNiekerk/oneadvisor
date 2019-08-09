import React from "react";

import Home from "./components/home/Home";
import Navbar from "./components/layout/Navbar";

const App: React.FC = () => {
    return (
        <div>
            <Navbar />
            <Home />
        </div>
    );
};

export default App;
