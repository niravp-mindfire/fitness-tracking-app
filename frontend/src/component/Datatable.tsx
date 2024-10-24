import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { DataTableProps, TableColumn } from '../utils/types';

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  onSort,
  onPageChange,
  totalCount,
  rowsPerPage,
  handleEdit,
  handleDelete,
  expandable = false,
  expandedRows,
  toggleRow,
  renderExpandableRow,
  sortField,
  sortOrder,
}) => {
  const [page, setPage] = React.useState<number>(0);
  const [order, setOrder] = React.useState(sortOrder || 'desc');
  const [orderBy, setOrderBy] = React.useState<string>(sortField || '');

  const handleSort = (column: any) => {
    const newOrder: 'asc' | 'desc' =
      orderBy === column.field && order === 'asc' ? 'desc' : 'asc';
    setOrder(newOrder);
    setOrderBy(column.field);
    onSort(column.field, newOrder);
  };

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
    onPageChange(newPage);
  };

  return (
    <div className="w-full">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-left">
            {/* Expandable Column Header */}
            {expandable && <th className="w-10"></th>}
            {columns.map((column: TableColumn) => (
              <th
                key={column.field}
                className="px-4 py-2 font-bold text-sm sm:text-base"
              >
                {column.sorting ? (
                  <button
                    onClick={() => handleSort(column)}
                    className="flex items-center space-x-2"
                  >
                    <span>{column.headerName}</span>
                    <span>
                      {orderBy === column.field ? (
                        order === 'asc' ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </span>
                  </button>
                ) : (
                  column.headerName
                )}
              </th>
            ))}
            <th className="px-4 py-2 font-bold text-sm sm:text-base">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 2}
                className="text-center py-4 text-gray-500"
              >
                No data found
              </td>
            </tr>
          ) : (
            data.map((row: any) => (
              <React.Fragment key={row.id}>
                <tr className="hover:bg-gray-100">
                  {/* Expand/Collapse Button Column */}
                  {expandable && (
                    <td className="px-4 py-2">
                      <button
                        onClick={() => toggleRow && toggleRow(row.id)}
                        className="text-blue-500"
                      >
                        {expandedRows?.includes(row.id) ? (
                          <KeyboardArrowDownIcon />
                        ) : (
                          <ChevronRightIcon />
                        )}
                      </button>
                    </td>
                  )}
                  {columns.map((column: TableColumn) => (
                    <td
                      key={column.field}
                      className="px-2 py-2 text-sm sm:px-4 sm:py-2 border-b border-gray-200"
                    >
                      {row[column.field]}
                    </td>
                  ))}
                  <td className="px-2 py-2 text-sm sm:px-4 sm:py-2 border-b border-gray-200">
                    <button
                      onClick={() => handleEdit(row.id)}
                      className="text-blue-500 mr-2"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="text-red-500"
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
                {expandable && expandedRows?.includes(row.id) && (
                  <tr>
                    <td colSpan={columns.length + 2} className="p-4">
                      {renderExpandableRow && renderExpandableRow(row)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
        <div className="w-full flex items-center justify-between">
          <div>
            <button
              onClick={(event) => handleChangePage(event, page - 1)}
              disabled={page === 0}
              className="text-gray-500"
            >
              Previous
            </button>
            <button
              onClick={(event) => handleChangePage(event, page + 1)}
              disabled={page >= Math.ceil(totalCount / rowsPerPage)}
              className="text-gray-500 ml-2"
            >
              Next
            </button>
          </div>
          <div>
            <span className="text-gray-700 text-sm sm:text-base">
              Page {page + 1} of {Math.ceil(totalCount / rowsPerPage)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
