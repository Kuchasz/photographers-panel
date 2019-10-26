import * as React from "react";
import { strings } from "../resources";

import contactPhoto from "../images/contact_foto.png";

type ContactProps = {};
type ContactState = {};

export class Contact extends React.Component<ContactProps, ContactState> {
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

                        <form action="kontakt" method="post" acceptCharset="utf-8">
                            {/* {$info} */}
                            <input type="text" name="name" placeholder={strings.contact.form.name} required></input>
                            <input type="text" name="email" placeholder={strings.contact.form.email} required></input>
                            <input type="text" name="subject" placeholder={strings.contact.form.subject} required></input>
                            <textarea name="content" placeholder={strings.contact.form.content} required></textarea>

                            <input type="submit" name="submit" value={strings.contact.form.submit}></input>
                        </form>
                    </article>

                    <hgroup>
                        <img src={contactPhoto} alt="" />
                    </hgroup>
                </section>
            </div>
        );
    }
}
