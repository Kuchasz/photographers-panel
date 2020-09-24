export const log = (message: string, err: any) => console.log(`${message} (${err === null ? "success" : "fail"})`);
