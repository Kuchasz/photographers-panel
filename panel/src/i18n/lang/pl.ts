export default {
    blog: {
        assignAssets: {
            title: "Dodaj zdjecia do bloga",
            save: "Zapisz",
            cancel: "Anuluj",
            assetRemoved: "Zdjecie usuniete prawidlowo",
            assetNotRemoved: "Wystapil blad podczas usuwania zdjecia",
            description: "Opis zdjecia",
            describeAsset: "Opisz zdjecie",
            delete: "Usun zdjecie",
            isMain: "Zdjecie jest glowne",
            setAsMain: "Ustaw jako glowne zdjecie"
        },
        create: {
            button: "Dodaj bloga",
            created: "Blog dodany pomyslnie",
            notCreated: "Wystapil blad podczas dodawania bloga",
            title: "Utworz nowego bloga",
            details: {
                title: {
                    label: "Tytul",
                    hint: "Tytul bloga"
                },
                alias: {
                    label: "Alias",
                    hint: "Alias bloga"
                },
                date: {
                    label: "Data",
                    hint: "Data dodania bloga"
                },
                content: {
                    label: "Tresc",
                    hint: "Tresc bloga"
                },
                tags: {
                    label: "Tagi",
                    hint: "Tagi dotyczace bloga"
                }
            },
            save: "Zapisz",
            cancel: "Anuluj"
        },
        edit: {
            edited: "Blog zapisany",
            notEdited: "Wystapil blad podczas edycji bloga",
            title: "Edytuj bloga",
            details: {
                title: {
                    label: "Tytul",
                    hint: "Tytul bloga"
                },
                alias: {
                    label: "Alias",
                    hint: "Alias bloga"
                },
                date: {
                    label: "Data",
                    hint: "Data dodania bloga"
                },
                content: {
                    label: "Tresc",
                    hint: "Tresc bloga"
                },
                tags: {
                    label: "Tagi",
                    hint: "Tagi dotyczace bloga"
                }
            },
            save: "Zapisz",
            cancel: "Anuluj"
        },
        delete: {
            deleted: "Blog zostal usuniety.",
            notDeleted: "Wystapil blad podczas usuwania bloga.",
            confirmationHeader: "Usuwanie bloga",
            confirmationContent: "Jestes pewien ze chcesz usunac bloga?"
        },
        list: {
            visible: "Widoczny",
            hidden: "Niewidoczny",
            visibilityTooltip: "Blog jest",
            headers: {
                visits: "Odwiedziny",
                comments: "Komentarze",
                date: "Data dodania",
                title: "Tytul",
                content: "Tresc"
            },
            actions: {
                edit: "Edytuj bloga",
                delete: "Usun bloga",
                assignAssets: "Dodaj zdjecia"
            }
        },
        stats: {
            todayVisits: "Dzisiejsze odwiedziny",
            totalVisits: "Wszystkich odwiedzin",
            rangeVisits: "Odwiedziny z zakresu",
            bestDay: "Najlepszy dzien",
            bestDayVisits: "Odwiedziny najlepszego dnia"
        }
    },
    validation: {
        required: "Wymagane",
        unique: "Musi byc unikalne",
        containLowercaseLetter: "Musi zawierac mala litere",
        containUppercaseLetter: "Musi zawierac duza litere",
        containNumber: "Musi zawierac cyfre",
        lowercaseAndNumbers: "Moze zawierac tylko male litery i numery",
        minLength: (min: number) => `Musi miec conajmniej ${min} znakow`,
        maxLength: (max: number) => `Moze miec maksymalnie ${max} znakow`,
        pattern: (pattern: string) => `Musi spelniac wzorzec: ${pattern}`,
        url: "Musi byc URLem",
        oneOf: "Musi byc jedna z zdefiniowanych wartosci"
    },
    menu: {
        home: "Start",
        stats: "Statystyki",
        galleries: "Galerie",
        blogs: "Blogi",
        comments: "Komentarze"
    },
    login: {
        button: "Zaloguj",
        logged: "Pomyslnie zalogowano!",
        notLogged: "Wystapil blad podczas proby zalogowania.",
        loginLabel: "Nazwa uzytkownika",
        loginTooltip: "Nazwa uzytkownika jest potrzebna zeby sie zalogowac",
        passwordLabel: "Haslo",
        passwordTooltip: "Haslo jest potrzebne zeby sie zalogowac",
        logoutButton: "Wyloguj sie",
        loggedOut: "Pomyslnie wylogowano!"
    },
    site: {
        stats: {
            todayVisits: "Dzisiejsze odwiedziny",
            totalVisits: "Wszystkich odwiedzin",
            rangeVisits: "Odwiedziny z zakresu",
            bestDay: "Najlepszy dzien",
            bestDayVisits: "Odwiedziny najlepszego dnia"
        }
    },
    gallery: {
        stats: {
            todayVisits: "Dzisiejsze odwiedziny",
            totalVisits: "Wszystkich odwiedzin",
            rangeVisits: "Odwiedziny z zakresu",
            bestDay: "Najlepszy dzien",
            bestDayVisits: "Odwiedziny najlepszego dnia",
            emails: "Adresy email"
        },
        states: {
            state: "Galleria jest",
            available: "dostepna",
            turnedOff: "wylaczona",
            notReady: "nie przygotowana"
        },
        list: {
            notAvailablePre: "Bloga",
            notAvailablePost: "niema",
            headers: {
                place: "Miejsce wesela",
                lastName: "Nazwisko",
                date: "Data wesela",
                password: "Haslo",
                totalVisits: "Wszystkich odwiedzin"
            },
            actions: {
                edit: "Edytuj galerie",
                delete: "Usun galerie",
                notificationsNotSend: "Powiadomienia nie zostaly wyslany",
                viewEmails: "Zobacz adresy email"
            }
        },  
        emailNotifications: {
            notified: "Wyslano powiadomienie.",
            notNotified: "Wystapil blad podczas wysylania powiadomienia.",
            title: "Wyslij powiadomienia",
            send: "Wyslij powiadomienie",
            cancel: "Anuluj",
            notifyTooltip: "Kliknij aby powiadomic uzytkownikow ze galeria zostala uruchomiona"
        },
        create: {
            created: "Galeria dodana pomyslnie",
            notCreated: "Wystapil blad podczas dodawania galerii",
            title: "Utworz nowa galerie",
            button: "Dodaj galerie",
            details: {
                place: {
                    label: "Miejsce wesela",
                    hint: "Miejsce w ktorym odbylo sie wesele"
                },
                date: {
                    label: "Data wesela",
                    hint: "Data, kiedy odbylo sie wesele"
                },
                bride: {
                    label: "Imie Mlodej Pani",
                    hint: "Imie Mlodej Pani"
                },
                groom: {
                    label: "Imie Mlodego Pana",
                    hint: "Imie Mlodego Pana"
                },
                lastName: {
                    label: "Nazwisko",
                    hint: "Nazwisko Mlodego Pana"
                },
                state: {
                    label: "Stan",
                    hint: "Stan uruchomienia galerii"
                },
                password: {
                    label: "Haslo",
                    hint: "Haslo do galerii"
                },
                directPath: {
                    label: "URL",
                    hint: "Bezwgledna sciezka do galerii"
                },
                blog: {
                    label: "Blog",
                    hint: "Blog przypisany do galerii"
                }
            },
            save: "Zapisz",
            cancel: "Anuluj"
        },
        delete: {
            deleted: "Galeria zostala usunieta.",
            notDeleted: "Wystapil blad podczas usuwania galerii.",
            confirmationHeader: "Usuwanie galerii",
            confirmationContent: "Jestes pewien ze chcesz usunac galerie?"
        },
        edit: {
            edited: "Galeria zapisana.",
            notEdited: "Wystapil blad podczas edycji galerii",
            title: "Edytuj galerie",
            details: {
                place: {
                    label: "Miejsce wesela",
                    hint: "Miejsce w ktorym odbylo sie wesele"
                },
                date: {
                    label: "Data wesela",
                    hint: "Data, kiedy odbylo sie wesele"
                },
                bride: {
                    label: "Imie Mlodej Pani",
                    hint: "Imie Mlodej Pani"
                },
                groom: {
                    label: "Imie Mlodego Pana",
                    hint: "Imie Mlodego Pana"
                },
                lastName: {
                    label: "Nazwisko",
                    hint: "Nazwisko Mlodego Pana"
                },
                state: {
                    label: "Stan",
                    hint: "Stan uruchomienia galerii"
                },
                password: {
                    label: "Haslo",
                    hint: "Haslo do galerii"
                },
                directPath: {
                    label: "URL",
                    hint: "Bezwgledna sciezka do galerii"
                },
                blog: {
                    label: "Blog",
                    hint: "Blog przypisany do galerii"
                }
            },
            save: "Zapisz",
            cancel: "Anuluj"
        }
    }
}