import { Schema, model, models } from "mongoose";

export type LandingPageEventType = "page_view" | "cta_click";

export type LandingPageCategory =
  | "county_lander"
  | "city_lander"
  | "dfw_satellite"
  | "austin_regional"
  | "san_antonio_regional"
  | "houston_regional"
  | "texas_index"
  | "service_area_hub"
  | "start_now"
  | "pricing"
  | "full_service"
  | "home"
  | "other_marketing";

const landingPageEventSchema = new Schema(
  {
    eventType: {
      type: String,
      required: true,
      enum: ["page_view", "cta_click"],
      index: true,
    },
    eventName: { type: String, trim: true, default: null, index: true },
    path: { type: String, required: true, trim: true, index: true },
    pageCategory: {
      type: String,
      required: true,
      enum: [
        "county_lander",
        "city_lander",
        "dfw_satellite",
        "austin_regional",
        "san_antonio_regional",
        "houston_regional",
        "texas_index",
        "service_area_hub",
        "start_now",
        "pricing",
        "full_service",
        "home",
        "other_marketing",
      ],
      index: true,
    },
    locale: { type: String, enum: ["en", "es"], default: "en", index: true },
    countySlug: { type: String, trim: true, default: null, index: true },
    citySlug: { type: String, trim: true, default: null },
    sessionId: { type: String, trim: true, default: null, index: true },
    referrer: { type: String, trim: true, default: null },
    utmSource: { type: String, trim: true, default: null, index: true },
    utmMedium: { type: String, trim: true, default: null },
    utmCampaign: { type: String, trim: true, default: null },
    utmContent: { type: String, trim: true, default: null },
    utmTerm: { type: String, trim: true, default: null },
  },
  { timestamps: true },
);

landingPageEventSchema.index({ createdAt: -1 });

export const LandingPageEvent =
  models.LandingPageEvent ?? model("LandingPageEvent", landingPageEventSchema);
