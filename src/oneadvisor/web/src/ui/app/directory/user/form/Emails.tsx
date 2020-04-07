import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { RootState } from "@/state";
import { UserEdit, userSelector } from "@/state/directory/users";
import { sendWelcomeEmail } from "@/state/email/actions";
import { Button } from "@/ui/controls";
import { showMessage } from "@/ui/feedback/notifcation";

type Props = {
    user: UserEdit | null;
} & DispatchProp;

type State = {
    sendingWelcomeEmail: boolean;
};

class Emails extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            sendingWelcomeEmail: false,
        };
    }

    sendWelcomeEmail = () => {
        if (!this.props.user || !this.props.user.id) return;

        this.setState({
            sendingWelcomeEmail: true,
        });
        showMessage("info", "Sending Email...", 1);
        this.props.dispatch(
            sendWelcomeEmail(
                this.props.user.id,
                () => {
                    this.setState({
                        sendingWelcomeEmail: false,
                    });
                    showMessage("success", "Email Sent Successfully", 2);
                },
                () => {
                    this.setState({
                        sendingWelcomeEmail: false,
                    });
                    showMessage("error", "Error sending email", 2);
                }
            )
        );
    };

    render() {
        return (
            <>
                <Button
                    onClick={this.sendWelcomeEmail}
                    loading={this.state.sendingWelcomeEmail}
                    type="primary"
                >
                    Send Welcome Email
                </Button>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const userState = userSelector(state);

    return {
        user: userState.user,
    };
};

export default connect(mapStateToProps)(Emails);
