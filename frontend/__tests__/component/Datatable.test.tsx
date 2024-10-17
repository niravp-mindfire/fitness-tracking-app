// DataTable.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DataTable from '../../src/component/Datatable'; // Adjust the import path as necessary
import { TableColumn } from '../../src/utils/types'; // Adjust the import path as necessary

const columns: TableColumn[] = [
  { field: 'name', headerName: 'Name', sorting: true },
  { field: 'age', headerName: 'Age', sorting: true },
];

const mockData = [
  { id: '1', name: 'John Doe', age: 28 },
  { id: '2', name: 'Jane Smith', age: 32 },
];

describe('DataTable', () => {
  const onSort = jest.fn();
  const onPageChange = jest.fn();
  const handleEdit = jest.fn();
  const handleDelete = jest.fn();
  const renderExpandableRow = jest.fn();

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock function calls after each test
  });

  it('renders the DataTable correctly', () => {
    render(
      <DataTable
        columns={columns}
        data={mockData}
        onSort={onSort}
        onPageChange={onPageChange}
        totalCount={mockData.length}
        rowsPerPage={10}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />,
    );
  });

  it('calls onSort when a sortable column header is clicked', () => {
    render(
      <DataTable
        columns={columns}
        data={mockData}
        onSort={onSort}
        onPageChange={onPageChange}
        totalCount={mockData.length}
        rowsPerPage={10}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />,
    );

    const nameHeader = screen.getByTestId('sort-label-name');
    fireEvent.click(nameHeader);

    expect(onSort).toHaveBeenCalledWith('name', 'asc');
    fireEvent.click(nameHeader); // Click again to sort descending
    expect(onSort).toHaveBeenCalledWith('name', 'desc');
  });

  it('calls onPageChange when the page is changed', () => {
    render(
      <DataTable
        columns={columns}
        data={mockData}
        onSort={onSort}
        onPageChange={onPageChange}
        totalCount={mockData.length}
        rowsPerPage={10}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />,
    );

    const nextPageButton: any = screen
      .getByTestId('pagination')
      .querySelector('button[aria-label="Go to next page"]');
    fireEvent.click(nextPageButton);
  });

  it('handles edit and delete actions', () => {
    render(
      <DataTable
        columns={columns}
        data={mockData}
        onSort={onSort}
        onPageChange={onPageChange}
        totalCount={mockData.length}
        rowsPerPage={10}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />,
    );

    const editButton = screen.getByTestId('edit-button-1');
    const deleteButton = screen.getByTestId('delete-button-1');

    fireEvent.click(editButton);
    expect(handleEdit).toHaveBeenCalledWith('1'); // ID of John Doe

    fireEvent.click(deleteButton);
    expect(handleDelete).toHaveBeenCalledWith('1'); // ID of John Doe
  });
});
