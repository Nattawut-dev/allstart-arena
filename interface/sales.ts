import { paymentStatusEnum } from "@/enum/paymentStatusEnum";
import { PaymentTypeEnum } from "@/enum/stateCashierEnum";
import { ICustomers } from "./customers";
import { ISalesDetails } from "./salesDetails";


export interface ISales {
    SaleID: number;
    SaleDate : Date;
    CustomerID? : number;
    BillNumber : string;
    TotalAmount : string;
    PaymentStatus : paymentStatusEnum;
    PaymentType : PaymentTypeEnum;
    cash_received? : string;
    give_change? : string;
    flag_delete : number;
    customer?: ICustomers;
    saleDetails? : ISalesDetails[];
}