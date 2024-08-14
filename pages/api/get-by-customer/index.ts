import { NextRequest, NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2';
import pool from '@/db/db';
import { ISales } from '@/interface/sales';
import { ISalesDetails } from '@/interface/salesDetails';
import { NextApiRequest, NextApiResponse } from 'next';
import { buffetStatusEnum } from '@/enum/buffetStatusEnum';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    const connection = await pool.getConnection();

    try {
        const { buffetId, buffetStatus } = req.query

        if (!buffetId) {
            return res.status(400).json({ error: 'buffetId is required' });
        }

        let selectby = ``
        let params = [];
        if (buffetStatus === buffetStatusEnum.CREDIT_USER) {
            selectby = '?'
            params.push(buffetId);
        } else {
            selectby = ` (SELECT pc.customerID FROM pos_customers pc WHERE pc.playerId = ? AND pc.buffetStatus = ?)`
            params.push(buffetId, buffetStatus);

        }

        // Query to select sales by CustomerID
        const salesQuery = `
            SELECT s.*
            FROM pos_sales s
            WHERE s.CustomerID = ${selectby}
            ORDER BY s.SaleID desc
        `;
        const [salesResult] = await connection.execute<RowDataPacket[]>(salesQuery, params);

        if (!salesResult || salesResult.length === 0) {
            return res.status(404).json({ message: 'No sales found for the specified CustomerID' });
        }

        // Map the salesResult to ISales[]
        const sales: ISales[] = salesResult.map((saleRow) => ({
            SaleID: saleRow.SaleID,
            SaleDate: saleRow.SaleDate,
            CustomerID: saleRow.CustomerID,
            BillNumber: saleRow.BillNumber,
            TotalAmount: saleRow.TotalAmount,
            PaymentStatus: saleRow.PaymentStatus,
            PaymentType: saleRow.PaymentType,
            cash_received: saleRow.cash_received,
            give_change: saleRow.give_change,
            flag_delete: saleRow.flag_delete,
        }));

        // Get the list of SaleIDs
        const saleIDs = sales.map(sale => sale.SaleID);

        // Properly format the SaleIDs for the IN clause
        const formattedSaleIDs = saleIDs.join(',');

        // Query to select sales details with product info by SaleID
        const salesDetailsQuery = `
                SELECT 
                    sd.SaleID,
                    sd.SaleDetailID,
                    sd.ProductID,
                    p.price AS productPrice,
                    p.ProductName,
                    sd.Quantity,
                    sd.Price,
                    (sd.Quantity * p.price) AS TotalSales
                FROM pos_salesdetails sd
                INNER JOIN pos_products p ON sd.ProductID = p.id
                WHERE sd.SaleID IN (${formattedSaleIDs})
        `;
        const [salesDetailsResult] = await connection.query<RowDataPacket[]>(salesDetailsQuery);

        // Map sale details to their respective sales
        const saleDetailsMap: { [key: number]: ISalesDetails[] } = salesDetailsResult.reduce((acc: { [key: number]: ISalesDetails[] }, detail: RowDataPacket) => {
            const { SaleID, SaleDetailID, ProductID, ProductName, productPrice, Quantity, Price, TotalSales } = detail;
            if (!acc[SaleID]) {
                acc[SaleID] = [];
            }
            acc[SaleID].push({
                SaleDetailID,
                ProductID,
                ProductName,
                productPrice,
                Quantity,
                Price,
                TotalSales,
            });
            return acc;
        }, {});

        const result = {
            sales: sales.map(sale => ({
                ...sale,
                saleDetails: saleDetailsMap[sale.SaleID] || [],
            }))
        };

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching sales data:', error);
        return res.status(500).json({ error: 'Error fetching sales data' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
