import * as React from "react";
import contactPhoto from "../images/page_contact_photo.png";
import { ResultType } from "@pp/api/dist/common";
import { send, SendResult } from "@pp/api/dist/site/message";
import { strings } from "../resources";

export const Contact = () => {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [content, setContent] = React.useState('');
    const [result, setResult] = React.useState<SendResult | undefined>();
    const [isLoading, setIsLoading] = React.useState(false);

    const sendMessage = async () => {
        setIsLoading(true);
        const sendResult = await send({ name, email, content });

        if (sendResult.type === ResultType.Success) {
            setContent('');
        }

        setResult(sendResult);
        setIsLoading(false);
    };

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
                        {strings.contact.address.map((a) => (
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
                        {isLoading ? (
                            <div className="cover">{strings.contact.form.sendingMessage}</div>
                        ) : null}
                        <div>
                            {result ? (
                                <div>
                                    {result.type === ResultType.Success
                                        ? strings.contact.form.messageSent
                                        : `${strings.contact.form.messsageNotSent}, ${strings.contact.form.errors[result.error]
                                        }`}
                                </div>
                            ) : null}
                            <input
                                type="text"
                                name="name"
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                placeholder={strings.contact.form.name}
                                required></input>
                            <input
                                type="email"
                                name="email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                placeholder={strings.contact.form.email}
                                required></input>
                            <textarea
                                name="content"
                                onChange={(e) => setContent(e.target.value)}
                                value={content}
                                placeholder={strings.contact.form.content}
                                required></textarea>
                            <div>
                                <a onClick={sendMessage} className="button">
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
};
