export default {
    blog: {
        assignAssets: {
            title: "Dodaj zdjecia do bloga",
            save: "Zapisz",
            cancel: "Anuluj",
            assetRemoved: "Zdjecie dodane prawidlowo",
            assetNotRemoved: "Wystapil blad podczas dodawania zdjecia",
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
        lowercaseAndNumbers: "Moze zawierac tylko male litery i numery",
        minLength: (min: number) => `Musi miec conajmniej ${min} znakow`,
        maxLength: (max: number) => `Moze miec maksymalnie ${max} znakow`,
        pattern: (pattern: string) => `Musi spelniac wzorzec: ${pattern}`
    },
    menu:{
        home: "Ekran domowy",
        stats: "Statystyki strony",
        galleries: "Galerie",
        blogs: "Blogi",
        comments: "Komentarze"
    }
}