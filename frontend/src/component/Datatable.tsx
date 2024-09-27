import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Button,
} from '@mui/material';
import { DataTableProps, TableColumn } from '../utils/types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  onSort,
  onPageChange,
  totalCount,
  rowsPerPage,
  handleEdit,
  handleDelete
}) => {
  const [page, setPage] = React.useState<number>(0);
  const [order, setOrder] = React.useState<'asc' | 'desc'>('desc');
  const [orderBy, setOrderBy] = React.useState<string>('');

  const handleSort = (column: any) => {
    const newOrder: 'asc' | 'desc' = orderBy === column.field && order === 'asc' ? 'desc' : 'asc';
    setOrder(newOrder);
    setOrderBy(column.field);
    onSort(column.field, newOrder); // Only pass the column field
  };

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
    onPageChange(newPage);
  };
  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column: TableColumn) => (
              <TableCell key={column.field} sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                {column.sorting ? (
                  <TableSortLabel
                    active={orderBy === column.field}
                    direction={orderBy === column.field ? order : 'desc'}
                    onClick={() => handleSort(column)}
                  >
                    {column.headerName}
                  </TableSortLabel>
                ) : (
                  column.headerName
                )}
              </TableCell>
            ))}
            <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row: any) => (
            <TableRow key={row.id}>
              {columns.map((column: TableColumn) => (
                <TableCell key={column.field}>{row[column.field]}</TableCell>
              ))}
              <TableCell>
                <Button size="small" color="primary" startIcon={<EditIcon />} onClick={() => handleEdit(row.id)}>
                  Edit
                </Button>
                <Button size="small" color="secondary" startIcon={<DeleteIcon />} onClick={() => handleDelete(row.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
    </Box>
  );
};

export default DataTable;
