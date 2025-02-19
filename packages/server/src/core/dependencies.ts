import path from "path";

export function getModulePath(pkgName: string) {
    return path.dirname(require.resolve(`${pkgName}/package.json`, { paths: [__dirname] }));
}

