import * as React from "react";
import { strings } from "../resources";
import { sendMessage, MessageSendResult } from "../../../api/send-message";
import { ResultType } from "../../../api/common";

import contactPhoto from "../images/contact_foto.png";

type ContactProps = {};
type ContactState = {
    name: string;
    email: string;
    content: string;
    result?: MessageSendResult;
    isLoading: boolean;
};

export class Contact extends React.Component<ContactProps, ContactState> {
    state = {
        name: "",
        email: "",
        content: "",
        result: undefined,
        isLoading: false
    } as ContactState;

    onNameChange(name: string) {
        this.setState({ name });
    }

    onEmailChange(email: string) {
        this.setState({ email });
    }

    onContentChange(content: string) {
        this.setState({ content });
    }

    sendMessage() {
        this.setState({ isLoading: true }, () => {
            sendMessage(this.state).then(result => this.setState({ result, isLoading: false }));
        });
    }

    render() {
        return (
            <div className="contact_form">
                <section>
                    <article>
                        <h1>{strings.contact.slogan.title}</h1>
                        <h2>
                            {strings.contact.slogan.description}
                            <br />
                            <br />
                            <strong>{strings.contact.addressLabel}</strong>
                            <br />
                            {strings.contact.address.map(a => (
                                <React.Fragment key={a}>
                                    {a}
                                    <br />
                                </React.Fragment>
                            ))}
                            <br />
                            <strong>{strings.contact.emailLabel}</strong> {strings.contact.email}
                            <br />
                            <strong>{strings.contact.phoneLabel}</strong> {strings.contact.phone}
                        </h2>

                        <div className="form">
                            {this.state.isLoading ? <div className="cover">Sending an message...</div> : null}
                            <div>
                                {this.state.result ? (
                                    <div>{this.state.result.type === ResultType.Success ? "Sent" : "Not sent"}</div>
                                ) : null}
                                <input
                                    type="text"
                                    name="name"
                                    onChange={e => this.onNameChange(e.target.value)}
                                    value={this.state.name}
                                    placeholder={strings.contact.form.name}
                                    required
                                ></input>
                                <input
                                    type="email"
                                    name="email"
                                    onChange={e => this.onEmailChange(e.target.value)}
                                    value={this.state.email}
                                    placeholder={strings.contact.form.email}
                                    required
                                ></input>
                                <textarea
                                    name="content"
                                    onChange={e => this.onContentChange(e.target.value)}
                                    value={this.state.content}
                                    placeholder={strings.contact.form.content}
                                    required
                                ></textarea>
                                <div>
                                    <a onClick={e => this.sendMessage()} className="button">
                                        {strings.contact.form.submit}
                                    </a>
                                </div>
                            </div>
                        </div>
                        <br />
                        <br />
                    </article>

                    <hgroup>
                        <img src={contactPhoto} alt="" />
                    </hgroup>
                </section>
            </div>
        );
    }
}