const concat = (list: any[]) => Array.prototype.concat.bind(list)
const promiseConcat = (f: Function) => (x: any[]) => f().then(concat(x))
const promiseReduce = (acc: Promise<any>, x: Function) => acc.then(promiseConcat(x))
/*
 * serial executes Promises sequentially.
 * @param {funcs} An array of funcs that return promises.
 * @example
 * const urls = ['/url1', '/url2', '/url3']
 * serial(urls.map(url => () => $.ajax(url)))
 *     .then(console.log.bind(console))
 */
export const serial = (funcs: Function[]) => funcs.reduce(promiseReduce, Promise.resolve([]))