import React from "react";
import { strings } from "../resources";

const Statistics = () => <ul>
    {strings.slogan.statistics.map(s => <li key={s.title}><span>{s.title}</span> {s.text}</li>)}
</ul>;

export const Slogan = () => <div className="slogan">
    <section>
        <h1>{strings.slogan.header}</h1>
        <Statistics />
    </section>
</div>;