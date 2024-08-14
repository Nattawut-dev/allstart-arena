import { PaymentTypeEnum } from "@/enum/stateCashierEnum"

export const renderPaymentType = (paymentType?: PaymentTypeEnum) => {
    switch (paymentType) {
        case PaymentTypeEnum.CASH:
            return 'เงินสด'
        case PaymentTypeEnum.TRANSFER:
            return 'เงินโอน'
        case PaymentTypeEnum.CUSTOMER:
            return 'ลูกค้า'
        default:
            return 'unknow'
    }
}