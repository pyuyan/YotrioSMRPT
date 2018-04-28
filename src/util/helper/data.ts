
import { mathHelper } from "./math";

export class dataHelper {
    
    constructor() {
        
    }

    /**
     * 组装数据，用于计算
     * @param datarow 
     */
    public static assemble(datarow:any) {
        let tmp_orderqty = Number.parseFloat(datarow.OrderQty);
        let tmp_salemny = tmp_orderqty * Number.parseFloat(datarow.SalePrice) * Number.parseFloat(datarow.ExchangeRate) / 10000;
        let tmp_tranfermny = 0;
        if (datarow.TransferPrice > 0)
            tmp_tranfermny = tmp_orderqty * Number.parseFloat(datarow.TransferPrice) / 10000;
        let tmp_gross = tmp_salemny - ((Number.parseFloat(datarow.NotConsume) + Number.parseFloat(datarow.DepreciateRate)) * tmp_salemny) - tmp_tranfermny;
        let tmp_GrossRate = tmp_gross / tmp_salemny * 100;
        
        return {
            BusinessDate: datarow.BusinessDate,
            MFGCode: datarow.MFGCode,
            MFGDept: datarow.MFGDept,
            ItemName: datarow.ItemName,
            OrderQty: tmp_orderqty,
            SaleMoney: mathHelper.GetFormatValue(tmp_salemny, 1),
            TransferMoney: mathHelper.GetFormatValue(tmp_tranfermny, 1),
            GrossRate: mathHelper.GetFormatValue(tmp_GrossRate, 4),
            ItemCode: datarow.ItemCode,
            RealGrossRate: tmp_GrossRate,
            Customer: datarow.Customer
        };
    }
}