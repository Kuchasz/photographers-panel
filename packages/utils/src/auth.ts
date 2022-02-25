export const doesHttpOnlyCookieExist = (cookiename: string) => {
    var d = new Date();
    d.setTime(d.getTime() + 1000);
    var expires = 'expires=' + d.toUTCString();

    document.cookie = cookiename + '=new_value;path=/;' + expires;
    if (document.cookie.indexOf(cookiename + '=') == -1) {
        return true;
    } else {
        return false;
    }
};
