"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ticketReplySchema = new mongoose_1.default.Schema({
    ticketId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: [true, 'Ticket ID is required'],
    },
    content: {
        type: String,
        required: [true, 'Reply content is required'],
        trim: true,
        maxlength: [10000, 'Reply cannot exceed 10000 characters'],
    },
    isInternal: {
        type: Boolean,
        default: false,
    },
    attachments: {
        type: [String],
        default: [],
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
}, {
    timestamps: true,
    toJSON: {
        transform(_doc, ret) {
            ret.id = ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
ticketReplySchema.index({ ticketId: 1 });
const TicketReply = mongoose_1.default.model('TicketReply', ticketReplySchema);
exports.default = TicketReply;
//# sourceMappingURL=TicketReply.js.map