import React, { useState } from "react";
import { Element } from "react-scroll";

import { requestDemoEmailApi } from "@/app/api";

const RequestDemo: React.FC = () => {
    const [email, setEmail] = useState("");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(false);

    async function requestDemo() {
        if (!email) return;

        setSent(false);
        setError(false);
        setSending(true);

        const response = await fetch(`${requestDemoEmailApi}?emailAddress=${encodeURIComponent(email)}`);

        if (response.ok) setSent(true);
        else setError(true);

        setSending(false);
    }

    return (
        <div className="container section">
            <div className="row">
                <div className="col text-center pb-5">
                    <Element name="request-demo-section">
                        <h2 className="border-bottom border-secondary d-inline border-width-2">DEMO</h2>
                    </Element>
                </div>
            </div>
            <div className="row">
                <div className="col text-center pb-5">
                    <p>
                        If you are interested in <span className="text-secondary">One Advisor</span> please let us know
                        and we will contact you to set up a demo at your convenience
                    </p>
                </div>
            </div>

            <div className="row justify-content-md-center">
                <div className="col-md-7 pb-5">
                    <div className="input-group input-group-lg">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter your email"
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-secondary"
                                type="button"
                                id="button-addon2"
                                onClick={requestDemo}
                                disabled={sending}
                            >
                                {sending ? "SENDING..." : "REQUEST DEMO"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col text-center pb-5">
                    {sent && (
                        <div className="alert alert-success" role="alert">
                            Thank you for requesting a demo, we will contact you to schedule a meeting.
                        </div>
                    )}
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            An error occured requesting a demo.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestDemo;
