export default {
    blog: {
        assignAssets: {
            title: "Assign blog assets",
            save: "Save",
            cancel: "Cancel",
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
        delete:{
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
        lowercaseAndNumbers: "May contain only lowercase letters and numbers",
        minLength: (min: number) => `Must be at least ${min} character long`,
        maxLength: (max: number) => `Must not be longer than ${max} characters`,
        pattern: (pattern: string) => `Must match the pattern: ${pattern}`
    },
    menu:{
        home: "Homescreen",
        stats: "Site statistics",
        galleries: "Galleries",
        blogs: "Blogs",
        comments: "Comments"
    }
}