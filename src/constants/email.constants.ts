import { EEmailActions } from "../enums";

export const allTemplates: {
    [key: string]: { subject: string; templateName: string };
} = {
    [EEmailActions.WELCOME]: {
        subject: "Great to see you in our app!",
        templateName: "register",
    },

    [EEmailActions.CHANGE_TYPE_ACCOUNT]: {
        subject: "Only one step left to the premium account!",
        templateName: "changeTypeAccount",
    },

    [EEmailActions.ADD_BRAND]: {
        subject: "Please add the following car brand.",
        templateName: "addBrand",
    },

    [EEmailActions.ADD_MODEL]: {
        subject: "Please add the following car model.",
        templateName: "addModel",
    },

    [EEmailActions.AD_VERIFICATION]: {
        subject: "Please check this ad for profanity!",
        templateName: "adVerification",
    },
};
