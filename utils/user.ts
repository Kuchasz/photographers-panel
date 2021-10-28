const userNameStorageKey = "user.name";

export const getOrRegisterName = (provideUserName: () => string) => {
    if (document === undefined)
        return "";

    let userName = localStorage.getItem(userNameStorageKey);
    if (!userName) {
        userName = provideUserName();
        localStorage.setItem(userNameStorageKey, userName);
    }

    return userName;
}