import React from "react";
import { Head } from "../layouts/head";
import { Slogan } from "../layouts/slogan";
import { Footer } from "../layouts/footer";
import { Header } from "../layouts/header";

export default () => <html>
    <Head />
    <body>
        <Header />
        <Slogan />
        <span>Some content here</span>
        <Footer />
    </body>
</html>