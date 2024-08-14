import { paymentStatusEnum } from "@/enum/paymentStatusEnum";
import { buffetStatusEnum } from "../enum/buffetStatusEnum";
import { customerPaymentStatusEnum } from "@/enum/customerPaymentStatusEnum";

export interface ICustomers {
    customerID: number;
    barcode: string;
    phone: string;
    playerId: number;
    customerName: string;
    register_date : Date;
    buffetStatus: buffetStatusEnum;
    pendingMoney? : number;
    PaymentStatus?: paymentStatusEnum;
    customerPaymentStatus?: customerPaymentStatusEnum;
}