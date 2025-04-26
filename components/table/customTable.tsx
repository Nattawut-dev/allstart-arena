import React from 'react';
import { Table, Pagination, Spinner } from 'react-bootstrap';
import Styles from './table.module.css';


interface TableComponentProps {
  data: any[];
  columns: { label: string; key: keyof any; formatter?: (cell: any, row: any) => React.ReactNode }[];
  isShowTotalprice?: boolean;
  currentPage?: number;
  totalPages?: number;
  itemsPerPage?: number;
  onPageChange?: (pageNumber: number) => void;
  isLoading?: boolean;
  isShowPagination?: boolean;
  onRowClick?: (row: any) => void;
  selectedRow?: any;
  isShowTotalSale?: boolean;
}


const CustomTable: React.FC<TableComponentProps> = ({
  data,
  columns,
  isShowTotalprice = false,
  currentPage = 1,
  totalPages = 1,
  itemsPerPage = 10,
  onPageChange = () => { },
  isLoading = false,
  isShowPagination = false,
  onRowClick,
  selectedRow,
  isShowTotalSale = false,
}) => {
  return (
    <div>
      <Table
        bordered
        hover
        size='sm'
        variant='table-primary'
        className={`${Styles.textheader} overflow-hidden col-9 table-light border-end mt-2  fs-6`}
      >
        <thead className='table-primary'>
          <tr>
            <th>ลำดับ</th>
            {columns.map((column, index) => (
              <th key={index}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className={`${Styles.textheader} table-light border-end`}>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`fs-6 ${selectedRow === row ? 'table-primary' : ''}`}
              onClick={() => onRowClick && onRowClick(row)}
              style={{
                cursor: onRowClick ? 'pointer' : 'default',
              }}
            >
              <td>{(currentPage - 1) * itemsPerPage + rowIndex + 1}</td>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className='align-middle'>
                  {column.formatter ? column.formatter(row[column.key], row) : (row as any)[column.key]}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length + 1} className='text-center fs-6'>
                {isLoading ? <Spinner animation='border' /> : 'No data'}
              </td>
            </tr>
          )}

        </tbody>
        {isShowTotalSale && (
          <tfoot >
            <tr >
              <td colSpan={4} className=' fs-6' style={{ backgroundColor: '#4A90E2' }}>
                <span className=' text-white' style={{ marginLeft: '120px' }} >ยอดสุทธิ</span>
              </td>
              <td className={`${Styles.noHover} fs-6 text-white `} style={{ backgroundColor: '#4A90E2' }}>
                {data.reduce((total, item) => (total + Number(item.TotalQuantity)), 0)}
              </td>
              <td className={`${Styles.noHover} fs-6 text-white`} style={{ backgroundColor: '#4A90E2' }}>
                {data.reduce((total, item) => (total + item.TotalSales), 0).toFixed(2)}
              </td>
            </tr>
          </tfoot>

        )}
      </Table>
      {isShowTotalprice && (
        <div className='d-flex justify-content-end'>
          ราคารวม: {data.reduce((total, item) => (total + item.totalprice), 0).toFixed(2)} บาท
        </div>
      )}
      {isShowPagination && data.length !== 0 && (
        <Pagination className='justify-content-center mt-3'>
          <Pagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
          {[...Array(totalPages)].map((_, pageIndex) => {
            const pageNumber = pageIndex + 1;
            const shouldRenderPage =
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2);

            if (!shouldRenderPage) {
              if (pageNumber === currentPage - 3 || pageNumber === currentPage + 3) {
                return <Pagination.Ellipsis key={pageIndex} />;
              }
              return null;
            }

            return (
              <Pagination.Item
                key={pageIndex}
                active={pageNumber === currentPage}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </Pagination.Item>
            );
          })}
          <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
      )}

    </div>
  );
};

export default CustomTable;
