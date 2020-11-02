import { Schema } from "rsuite";
import { checkPasswordIsUnique } from "@pp/api/panel/private-gallery";
import { PrivateGalleryState } from "@pp/api/private-gallery";

export const galleryModel = (galleryId?: number) => Schema.Model({
    place: Schema.Types.StringType()
        .isRequired("Place of the wedding must be set.")
        .minLength(2, "Place of the wedding must be at least 2 characters long."),
    date: Schema.Types.DateType().isRequired("Date of the wedding must be set."),
    bride: Schema.Types.StringType()
        .isRequired("Name of the bride must be set.")
        .minLength(3, "Bride of the wedding must be at least 3 characters long."),
    groom: Schema.Types.StringType()
        .isRequired("Name of the groom must be set.")
        .minLength(3, "Groom of the wedding must be at least 3 characters long."),
    lastName: Schema.Types.StringType()
        .isRequired("Last name must be set.")
        .minLength(3, "Last name must be at least 3 characters long."),
    state: Schema.Types.NumberType()
        .isRequired("State must be set.")
        .isOneOf(
            [PrivateGalleryState.Available, PrivateGalleryState.NotReady, PrivateGalleryState.TurnedOff],
            "State can only be only of specified values."
        ),
    password: Schema.Types.StringType()
        .isRequired("Password is required.")
        .containsUppercaseLetter("Password should contain uppercase letter.")
        .containsLowercaseLetter("Password should contain lowercase letter.")
        .containsNumber("Password must contain numbers.")
        .minLength(8, "Password must be at least 8 characters long.")
        .addRule(checkPasswordIsUnique(galleryId), "Password must be unique."),
    directPath: Schema.Types.StringType().isURL("Direct path must be an url."),
    blog: Schema.Types.NumberType()
});
