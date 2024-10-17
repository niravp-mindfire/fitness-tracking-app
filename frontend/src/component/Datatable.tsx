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
  Typography, // Import Typography for styling
} from '@mui/material';
import { DataTableProps, TableColumn } from '../utils/types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

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
}) => {
  const [page, setPage] = React.useState<number>(0);
  const [order, setOrder] = React.useState<'asc' | 'desc'>('desc');
  const [orderBy, setOrderBy] = React.useState<string>('');

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
    <Box sx={{ width: '100%' }}>
      <Table sx={{ width: '100%' }} data-testid="data-table">
        <TableHead>
          <TableRow>
            {/* Add an empty header for the expandable column */}
            <TableCell
              sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}
            />
            {columns.map((column: TableColumn) => (
              <TableCell
                key={column.field}
                sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}
              >
                {column.sorting ? (
                  <TableSortLabel
                    active={orderBy === column.field}
                    direction={orderBy === column.field ? order : 'asc'}
                    onClick={() => handleSort(column)}
                    data-testid={`sort-label-${column.field}`}
                  >
                    {column.headerName}
                  </TableSortLabel>
                ) : (
                  column.headerName
                )}
              </TableCell>
            ))}
            <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 2} align="center">
                <Typography variant="body2" color="textSecondary">
                  No data found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row: any) => (
              <React.Fragment key={row.id}>
                <TableRow>
                  {/* Expand/Collapse Button Column */}
                  <TableCell>
                    {expandable && (
                      <Button
                        onClick={() => toggleRow && toggleRow(row.id)}
                        data-testid={`toggle-row-${row.id}`}
                      >
                        {expandedRows?.includes(row.id) ? (
                          <KeyboardArrowDownIcon />
                        ) : (
                          <ChevronRightIcon />
                        )}
                      </Button>
                    )}
                  </TableCell>
                  {/* Other Data Columns */}
                  {columns.map((column: TableColumn) => (
                    <TableCell
                      key={column.field}
                      data-testid={`cell-${column.field}-${row.id}`}
                    >
                      {row[column.field]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button
                      onClick={() => handleEdit(row.id)}
                      data-testid={`edit-button-${row.id}`}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      onClick={() => handleDelete(row.id)}
                      data-testid={`delete-button-${row.id}`}
                    >
                      <DeleteIcon color="error" />
                    </Button>
                  </TableCell>
                </TableRow>
                {expandable && expandedRows?.includes(row.id) && (
                  <TableRow>
                    <TableCell colSpan={columns.length + 2} sx={{ padding: 0 }}>
                      {renderExpandableRow && renderExpandableRow(row)}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <TablePagination
          sx={{ width: '100%' }} // Set width to 100%
          rowsPerPageOptions={[10, 25, 50]}
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          data-testid="pagination"
        />
      </Box>
    </Box>
  );
};

export default DataTable;
