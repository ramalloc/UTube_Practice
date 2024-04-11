import mongoose, { Schema } from "mongoose";

const subscriptionModel = new Schema(
    {
        subscriber: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        channelSubscribedByUser: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
    },
    { timestamps: true }
)

export const Subscription = mongoose.model("Subscription", subscriptionModel)