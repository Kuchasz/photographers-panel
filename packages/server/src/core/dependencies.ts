import { dirname, join } from "path";

function getModulePath(pkgName: string) {
    return dirname(require.resolve(`${pkgName}/package.json`, { paths: [__dirname] }));
}

export function resolveModulePath(pkgName: string, path: string) {
    return join(getModulePath(pkgName), path);
}
