import { buffetPaymentStatusEnum } from "@/enum/buffetPaymentStatusEnum";
import { IsStudentEnum } from "@/enum/StudentPriceEnum";

export interface IBuffet {
    id: number;
    nickname: string;
    usedate: string;
    phone: string;
    price: string;
    shuttle_cock: number;
    paymentStatus: buffetPaymentStatusEnum;
    paymentSlip: string;
    regisDate: string;
    isStudent: IsStudentEnum;
    pendingMoney?: number;
    barcode: string;
}
