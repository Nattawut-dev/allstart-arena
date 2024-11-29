import { buffetPaymentStatusEnum } from "@/enum/buffetPaymentStatusEnum";
import { SkillLevelEnum } from "@/enum/skillLevelEnum";
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

export interface IQBuffet {
    id: number;
    nickname: string;
    usedate: string;
    phone: string;
    price: number;
    shuttle_cock: number;
    q_id: number;
    q_list: number;
    paymentStatus: number;
    paymentSlip: string;
    regisDate: string;
    T_value: string;
    shuttle_cock_price: number;
    couterPlay: number;
    court_price: number;
    isStudent: IsStudentEnum;
    pendingMoney?: number;
    skillLevel: SkillLevelEnum;
}