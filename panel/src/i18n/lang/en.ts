export default {
    blog: {
        assignAssets: {
            title: "Assign blog assets",
            ok: "OK",
            assetRemoved: "Blog asset removed.",
            assetNotRemoved: "An error ocurred while removing blog asset.",
            description: "Description",
            describeAsset: "Describe the asset.",
            delete: "Delete asset",
            isMain: "Asset is main",
            setAsMain: "Set asset as main"
        },
        create: {
            button: "Create Blog",
            created: "Blog successfully added.",
            notCreated: "An error occured while adding blog.",
            title: "Create new blog",
            details: {
                title: {
                    label: "Title",
                    hint: "Title of the blog"
                },
                alias: {
                    label: "Alias",
                    hint: "Alias of the blog"
                },
                date: {
                    label: "Date",
                    hint: "Date of the blog"
                },
                content: {
                    label: "Content",
                    hint: "Content of the blog"
                },
                tags: {
                    label: "Tags",
                    hint: "Tags of the blog"
                }
            },
            save: "Save",
            cancel: "Cancel"
        },
        edit: {
            edited: "Blog successfully edited.",
            notEdited: "An error occured while editing blog.",
            title: "Edit blog",
            details: {
                title: {
                    label: "Title",
                    hint: "Title of the blog"
                },
                alias: {
                    label: "Alias",
                    hint: "Alias of the blog"
                },
                date: {
                    label: "Date",
                    hint: "Date of the blog"
                },
                content: {
                    label: "Content",
                    hint: "Content of the blog"
                },
                tags: {
                    label: "Tags",
                    hint: "Tags of the blog"
                }
            },
            save: "Save",
            cancel: "Cancel"
        },
        delete: {
            deleted: "Blog deleted.",
            notDeleted: "An error occured while deleting blog.",
            confirmationHeader: "Removing of blog",
            confirmationContent: "You are sure you want to remove the blog?"
        },
        list: {
            visible: "Visible",
            hidden: "Hidden",
            visibilityTooltip: "Blog is",
            headers: {
                visits: "Visits",
                comments: "Comments",
                date: "Date",
                title: "Title",
                content: "Content"
            },
            actions: {
                edit: "Edit blog",
                delete: "Delete blog",
                assignAssets: "Assign assets"
            }
        },
        stats: {
            todayVisits: "Today Visits",
            totalVisits: "Total Visits",
            rangeVisits: "Range Visits",
            bestDay: "Best Day",
            bestDayVisits: "Best Day Visits"
        }
    },
    validation: {
        required: "Must be set",
        unique: "Must be unique",
        containLowercaseLetter: "Should contain lowercase letter",
        containUppercaseLetter: "Should contain uppercase  letter",
        containNumber: "Should contain number",
        lowercaseAndNumbers: "May contain only lowercase letters and numbers",
        minLength: (min: number) => `Must be at least ${min} character long`,
        maxLength: (max: number) => `Must not be longer than ${max} characters`,
        pattern: (pattern: string) => `Must match the pattern: ${pattern}`,
        url: "Must be an URL",
        oneOf: "Must be one of the specifiec values"
    },
    menu: {
        home: "Home",
        stats: "Statistics",
        galleries: "Galleries",
        blogs: "Blogs",
        comments: "Comments",
        transfers: "Transfers"
    },
    login: {
        button: "Log in",
        logged: "Successfully logged-in!",
        notLogged: "An error occured while logging-in.",
        loginLabel: "Username",
        loginTooltip: "Username needed to Login",
        passwordLabel: "Password",
        passwordTooltip: "Password needed to Login",
        logoutButton: "Logout",
        loggedOut: "Successfully logged-out!"
    },
    site: {
        stats: {
            todayVisits: "Today Visits",
            totalVisits: "Total Visits",
            rangeVisits: "Range Visits",
            bestDay: "Best Day",
            bestDayVisits: "Best Day Visits"
        }
    },
    imagesUploader:{
        notUploaded: "An issue occured while uploading image",
        leftImages: "left",
        noItemsLeft: "No uploads in progress"
    },
    gallery: {
        stats: {
            todayVisits: "Today Visits",
            totalVisits: "Total Visits",
            rangeVisits: "Range Visits",
            bestDay: "Best Day",
            bestDayVisits: "Best Day Visits",
            emails: "Emails"
        },
        states: {
            state: "Gallery is",
            available: "available",
            turnedOff: "turned off",
            notReady: "not ready"
        },
        list: {
            blogNotAvailable: "There is no blog",
            blogAvailable: "Blog is available",
            headers: {
                title: "Title",
                notes: "Notes",
                date: "Date",
                password: "Password",
                totalVisits: "Total Visits"
            },
            actions: {
                edit: "Edit gallery",
                delete: "Delete gallery",
                notificationsNotSend: "Notifications not send",
                viewEmails: "View emails"
            }
        },
        emailNotifications: {
            notified: "Subscribers notified.",
            notNotified: "An error occured while notifying subscribers.",
            title: "Send email notifications",
            send: "Send notification",
            cancel: "Cancel",
            notifyTooltip: "Click to notify subscribers about gallery being available"
        },
        create: {
            created: "Gallery successfully added.",
            notCreated: "An error occured while adding gallery.",
            title: "Create new gallery",
            button: "Create gallery",
            details: {
                date: {
                    label: "Date",
                    hint: "Date of the wedding"
                },
                title: {
                    label: "Title",
                    hint: "Title of the gallery"
                },
                notes: {
                    label: "Notes",
                    hint: "Notes about the gallery"
                },
                state: {
                    label: "State",
                    hint: "State of the gallery"
                },
                password: {
                    label: "Password",
                    hint: "Password for the gallery"
                },
                directPath: {
                    label: "Direct Path",
                    hint: "Direct Path to the gallery"
                },
                blog: {
                    label: "Blog",
                    hint: "Blog of the wedding"
                }
            },
            save: "Save",
            cancel: "Cancel"
        },
        delete: {
            deleted: "Gallery deleted.",
            notDeleted: "An error occured while deleting gallery.",
            confirmationHeader: "Removing of gallery",
            confirmationContent: "You are sure you want to remove the gallery?"
        },
        edit: {
            edited: "Gallery successfully edited.",
            notEdited: "An error occured while editing gallery.",
            title: "Edit gallery",
            details: {
                date: {
                    label: "Date",
                    hint: "Date of the wedding"
                },
                title: {
                    label: "Title",
                    hint: "Title of the gallery"
                },
                notes: {
                    label: "Notes",
                    hint: "Notes about the gallery"
                },
                state: {
                    label: "State",
                    hint: "State of the gallery"
                },
                password: {
                    label: "Password",
                    hint: "Password for the gallery"
                },
                directPath: {
                    label: "Direct Path",
                    hint: "Direct Path to the gallery"
                },
                blog: {
                    label: "Blog",
                    hint: "Blog of the wedding"
                }
            },
            save: "Save",
            cancel: "Cancel"
        }
    }
}