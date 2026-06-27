import mongoose, { Document, Types } from 'mongoose';
interface IDeliveryAddress {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
}
interface IPoItem {
    productId?: Types.ObjectId;
    description: string;
    quantity: number;
    receivedQty?: number;
    unitPrice: number;
    taxRate?: number;
    totalAmount: number;
}
export interface IPurchaseOrder extends Document {
    poNumber: string;
    vendorId: Types.ObjectId;
    companyId: Types.ObjectId;
    status?: string;
    orderDate?: Date;
    expectedDate?: Date;
    deliveryAddress?: IDeliveryAddress;
    items?: IPoItem[];
    subtotal?: number;
    taxAmount?: number;
    discount?: number;
    totalAmount?: number;
    notes?: string;
    createdBy?: Types.ObjectId;
    approvedBy?: Types.ObjectId;
    approvedAt?: Date;
    rejectedAt?: Date;
    cancelledAt?: Date;
    cancelReason?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const PurchaseOrder: mongoose.Model<IPurchaseOrder, {}, {}, {}, mongoose.Document<unknown, {}, IPurchaseOrder, {}, {}> & IPurchaseOrder & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default PurchaseOrder;
//# sourceMappingURL=PurchaseOrder.d.ts.map