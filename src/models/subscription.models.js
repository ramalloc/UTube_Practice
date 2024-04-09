import mongoose, { Schema } from "mongoose";

const subscriptionModel = new Schema(
    {
        subscribers: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        channelSubscribed: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
    },
    { timestamps: true }
)

export const Subscription = mongoose.model("Subscription", subscriptionModel)