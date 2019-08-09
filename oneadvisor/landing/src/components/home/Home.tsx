import React from "react";

import backgroundImage from "../../media/background.svg";
import Jumbotron from "./Jumbotron";
import Team from "./Team";

const Home: React.FC = () => {
    return (
        <>
            <div
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="container main">
                    <Jumbotron />
                </div>
            </div>
            <div>
                <div className="container">
                    <Team />
                </div>
            </div>
        </>
    );
};

export default Home;
