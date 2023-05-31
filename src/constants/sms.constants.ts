import { ESmsActions } from "../enums";

export const smsTemplates: {
  [key: string]: string;
} = {
  [ESmsActions.WELCOME]: "Thank you for registering on our AUTO.RIA website!",
};
