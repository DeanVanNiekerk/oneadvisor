import React from "react";

const BrowserNotSupported: React.FC = () => {
    return (
        <div className="pt-4">
            <h3 className="text-center">Warning</h3>
            <div className="text-center">
                One Advisor is currently on supported in{" "}
                <a href="https://www.google.com/chrome/" target="_blank" rel="noopener noreferrer">
                    Chrome
                </a>
                {", "}
                <a
                    href="https://www.mozilla.org/en-US/firefox/new/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Firefox
                </a>
                {" and "}
                <a
                    href="https://www.microsoft.com/en-us/edge"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Edge
                </a>
            </div>
        </div>
    );
};

export default BrowserNotSupported;
