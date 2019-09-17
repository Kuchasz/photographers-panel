import React from "react";
import { strings } from "../resources";

export const Head = () =>
    <head>
        <meta name="Description" content={strings.head.description} />
        <meta name="Keywords" content={strings.head.keywords} />
        <title>{strings.head.title}</title>
    </head>