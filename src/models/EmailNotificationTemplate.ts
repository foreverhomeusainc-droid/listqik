import { Schema, model, models } from "mongoose";

const emailNotificationTemplateSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true, index: true },
    subject: { type: String, required: true, trim: true },
    textBody: { type: String, required: true },
    htmlBody: { type: String, default: "" },
    updatedByEmail: { type: String, trim: true, lowercase: true },
  },
  { timestamps: true },
);

export const EmailNotificationTemplate =
  models.EmailNotificationTemplate ??
  model("EmailNotificationTemplate", emailNotificationTemplateSchema);
