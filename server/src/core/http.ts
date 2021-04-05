import { get } from "https";

export const getHttp = <T>(url: string) => new Promise<T>((resolve, _) => {
    get(url, (res) => {
        var body = '';

        res.on('data', (chunk) => {
            body += chunk;
        });

        res.on('end', () => {
            var response = JSON.parse(body);
            resolve(response);
        });
    }).on('error', (e) => {
        console.log("Got an error: ", e);
    });
});