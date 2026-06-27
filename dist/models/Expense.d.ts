import mongoose, { Document, Types } from 'mongoose';
export interface IExpense extends Document {
    title: string;
    category: string;
    amount: number;
    currency?: string;
    date: Date;
    receipt?: string;
    notes?: string;
    status: string;
    companyId: Types.ObjectId;
    employeeId: Types.ObjectId;
    approvedBy?: Types.ObjectId;
    approvedAt?: Date;
    rejectedAt?: Date;
    rejectedBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Expense: mongoose.Model<IExpense, {}, {}, {}, mongoose.Document<unknown, {}, IExpense, {}, {}> & IExpense & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Expense;
//# sourceMappingURL=Expense.d.ts.map