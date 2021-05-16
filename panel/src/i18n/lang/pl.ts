export default {
    blog: {
        assignAssets: {
            title: 'Dodaj zdjęcia do bloga',
            ok: 'OK',
            assetRemoved: 'Zdjęcie usunięte prawidłowo',
            assetNotRemoved: 'Wystąpił błąd podczas usuwania zdjęcia',
            description: 'Opis zdjęcia',
            describeAsset: 'Opisz zdjęcie',
            delete: 'Usun zdjęcie',
            isMain: 'zdjęcie jest glowne',
            setAsMain: 'Ustaw jako glowne zdjęcie',
        },
        create: {
            button: 'Dodaj bloga',
            created: 'Blog dodany pomyślnie',
            notCreated: 'Wystąpił błąd podczas dodawania bloga',
            title: 'Utworz nowego bloga',
            details: {
                title: {
                    label: 'Tytuł',
                    hint: 'Tytuł bloga',
                },
                alias: {
                    label: 'Alias',
                    hint: 'Alias bloga',
                },
                date: {
                    label: 'Data',
                    hint: 'Data dodania bloga',
                },
                content: {
                    label: 'Treść',
                    hint: 'Treść bloga',
                },
                tags: {
                    label: 'Tagi',
                    hint: 'Tagi dotyczące bloga',
                },
            },
            save: 'Zapisz',
            cancel: 'Anuluj',
        },
        edit: {
            edited: 'Blog zapisany',
            notEdited: 'Wystąpił błąd podczas edycji bloga',
            title: 'Edytuj bloga',
            details: {
                title: {
                    label: 'Tytuł',
                    hint: 'Tytuł bloga',
                },
                alias: {
                    label: 'Alias',
                    hint: 'Alias bloga',
                },
                date: {
                    label: 'Data',
                    hint: 'Data dodania bloga',
                },
                content: {
                    label: 'Treść',
                    hint: 'Treść bloga',
                },
                tags: {
                    label: 'Tagi',
                    hint: 'Tagi dotyczące bloga',
                },
            },
            save: 'Zapisz',
            cancel: 'Anuluj',
        },
        delete: {
            deleted: 'Blog został usunięty.',
            notDeleted: 'Wystąpił błąd podczas usuwania bloga.',
            confirmationHeader: 'Usuwanie bloga',
            confirmationContent: 'Jesteś pewien ze chcesz usunąć bloga?',
        },
        list: {
            visible: 'Widoczny',
            hidden: 'Niewidoczny',
            visibilityTooltip: 'Blog jest',
            headers: {
                visits: 'Odwiedziny',
                comments: 'Komentarze',
                date: 'Data dodania',
                title: 'Tytuł',
                content: 'Treść',
            },
            actions: {
                edit: 'Edytuj bloga',
                delete: 'Usun bloga',
                assignAssets: 'Dodaj zdjęcia',
            },
        },
        stats: {
            todayVisits: 'Dzisiejsze odwiedziny',
            totalVisits: 'Wszystkich odwiedzin',
            rangeVisits: 'Odwiedziny z zakresu',
            bestDay: 'Najlepszy dzień',
            bestDayVisits: 'Odwiedziny najlepszego dnia',
        },
    },
    validation: {
        required: 'Wymagane',
        unique: 'Musi byc unikalne',
        containLowercaseLetter: 'Musi zawierać mala litere',
        containUppercaseLetter: 'Musi zawierać duza litere',
        containNumber: 'Musi zawierać cyfre',
        lowercaseAndNumbers: 'Moze zawierać tylko male litery i numery',
        minLength: (min: number) => `Musi miec conajmniej ${min} znaków`,
        maxLength: (max: number) => `Moze miec maksymalnie ${max} znaków`,
        pattern: (pattern: string) => `Musi spelniac wzorzec: ${pattern}`,
        url: 'Musi byc URLem',
        oneOf: 'Musi byc jedna z zdefiniowanych wartości',
    },
    dashboard: {
        mainBlogs: {
            leftBlog: {
                hint: 'Blog, który będzie pojawiać się po lewej stronie na stronie głównej',
                label: 'Lewy blog',
            },
            rightBlog: {
                hint: 'Blog, który będzie pojawiać się po prawej stronie na stronie głównej',
                label: 'Prawy blog',
            },
            edited: 'Zmieniono główne blogi',
            notEdited: 'Wystąpił błąd podczas zmiany głównych blogów',
        },
    },
    events: {
        types: {
            calculatorConfigChanged: 'Zmiana ustawien kalkulatora',
            photoLiked: 'Polubienie zdjecia',
            photoUnliked: 'Odlubienie zdjecia',
            photoDownloaded: 'Pobranie zdjecia',
            displayRatingRequestScreen: 'Wyswietlono ekran prosby o opinie',
            navigatedToRating: 'Nawigowano do wystawienia opinii',
            closeRatingRequestScreen: 'Zamknieto ekran prosby o opinie'
        }
    },
    menu: {
        home: 'Start',
        stats: 'Statystyki',
        galleries: 'Galerie',
        blogs: 'Blogi',
        comments: 'Komentarze',
        transfers: 'Transfery',
    },
    login: {
        button: 'Zaloguj',
        logged: 'Pomyślnie zalogowano!',
        notLogged: 'Wystąpił błąd podczas proby zalogowania.',
        loginLabel: 'Nazwa uzytkownika',
        loginTooltip: 'Nazwa uzytkownika jest potrzebna zeby sie zalogowac',
        passwordLabel: 'Hasło',
        passwordTooltip: 'Hasło jest potrzebne zeby sie zalogowac',
        logoutButton: 'Wyloguj sie',
        loggedOut: 'Pomyślnie wylogowano!',
    },
    site: {
        stats: {
            todayVisits: 'Dzisiejsze odwiedziny',
            totalVisits: 'Wszystkich odwiedzin',
            rangeVisits: 'Odwiedziny z zakresu',
            bestDay: 'Najlepszy dzień',
            bestDayVisits: 'Odwiedziny najlepszego dnia',
        },
    },
    imagesUploader: {
        notUploaded: 'Wystąpił błąd podczas przesylania zdjęcia',
        leftImages: 'pozostało',
        noItemsLeft: 'Brak transferów w toku',
    },
    gallery: {
        stats: {
            todayVisits: 'Dzisiejsze odwiedziny',
            totalVisits: 'Wszystkich odwiedzin',
            rangeVisits: 'Odwiedziny z zakresu',
            bestDay: 'Najlepszy dzień',
            bestDayVisits: 'Odwiedziny najlepszego dnia',
            emails: 'Adresy email',
        },
        states: {
            state: 'Galleria jest',
            available: 'dostepna',
            turnedOff: 'wyłączona',
            notReady: 'nie przygotowana',
        },
        list: {
            blogNotAvailable: 'Bloga niema',
            blogAvailable: 'Blog jest dostepny',
            headers: {
                title: 'Tytuł',
                notes: 'Notatki',
                date: 'Data wesela',
                password: 'Hasło',
                totalVisits: 'Wszystkich odwiedzin',
            },
            actions: {
                edit: 'Edytuj galerię',
                delete: 'Usun galerię',
                notificationsNotSend: 'Powiadomienia nie zostały wysłane',
                viewEmails: 'Zobacz adresy email',
            },
        },
        emailNotifications: {
            notified: 'Wysłano powiadomienie.',
            notNotified: 'Wystąpił błąd podczas wysyłania powiadomienia.',
            title: 'Wyślij powiadomienia',
            send: 'Wyślij powiadomienie',
            cancel: 'Anuluj',
            notifyTooltip: 'Kliknij aby powiadomić użytkowników że galeria została uruchomiona',
        },
        create: {
            created: 'Galeria dodana pomyślnie',
            notCreated: 'Wystąpił błąd podczas dodawania galerii',
            title: 'Utworz nowa galerię',
            button: 'Dodaj galerię',
            details: {
                date: {
                    label: 'Data wesela',
                    hint: 'Data, kiedy odbyło się wesele',
                },
                title: {
                    label: 'Tytuł',
                    hint: 'Tytuł wyswietlany gościom galerii',
                },
                notes: {
                    label: 'Notatki',
                    hint: 'Notatki o weselu',
                },
                state: {
                    label: 'Stan',
                    hint: 'Stan uruchomienia galerii',
                },
                password: {
                    label: 'Hasło',
                    hint: 'Hasło do galerii',
                },
                directPath: {
                    label: 'URL',
                    hint: 'Bezwględna sciezka do galerii',
                },
                blog: {
                    label: 'Blog',
                    hint: 'Blog przypisany do galerii',
                },
            },
            save: 'Zapisz',
            cancel: 'Anuluj',
        },
        delete: {
            deleted: 'Galeria została usunięta.',
            notDeleted: 'Wystąpił błąd podczas usuwania galerii.',
            confirmationHeader: 'Usuwanie galerii',
            confirmationContent: 'Jesteś pewien ze chcesz usunąć galerię?',
        },
        edit: {
            edited: 'Galeria zapisana.',
            notEdited: 'Wystąpił błąd podczas edycji galerii',
            title: 'Edytuj galerię',
            details: {
                date: {
                    label: 'Data wesela',
                    hint: 'Data, kiedy odbyło sie wesele',
                },
                title: {
                    label: 'Tytuł',
                    hint: 'Tytuł wyswietlany gościom galerii',
                },
                notes: {
                    label: 'Notatki',
                    hint: 'Notatki o weselu',
                },
                state: {
                    label: 'Stan',
                    hint: 'Stan uruchomienia galerii',
                },
                password: {
                    label: 'Hasło',
                    hint: 'Hasło do galerii',
                },
                directPath: {
                    label: 'URL',
                    hint: 'Bezwgledna sciezka do galerii',
                },
                blog: {
                    label: 'Blog',
                    hint: 'Blog przypisany do galerii',
                },
            },
            save: 'Zapisz',
            cancel: 'Anuluj',
        },
    },
};
