import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchFoodItems,
  deleteFoodItem,
} from '../../features/foodItem/foodItem';
import DataTable from '../../component/Datatable';
import { TableColumn } from '../../utils/types';
import { useNavigate } from 'react-router-dom';
import { path } from '../../utils/path';
import SnackAlert from '../../component/SnackAlert';

const FoodItemList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { foodItems, totalCount, loading } = useAppSelector(
    (state) => state.foodItem,
  );

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('name');
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedFoodItemId, setSelectedFoodItemId] = useState<string | null>(
    null,
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  useEffect(() => {
    getAllData();
  }, [dispatch, searchTerm, page, rowsPerPage, orderBy, order]);

  const getAllData = () => {
    dispatch(
      fetchFoodItems({
        search: searchTerm,
        page: page + 1,
        limit: rowsPerPage,
        sort: orderBy,
        order,
      }),
    );
  };

  const handleSort = (field: string, newOrder: 'asc' | 'desc') => {
    setOrder(newOrder);
    setOrderBy(field);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedFoodItemId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedFoodItemId) {
      dispatch(deleteFoodItem(selectedFoodItemId)).then((res) => {
        getAllData();
      });
    }
    setDialogOpen(false);
    setSnackbarOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleAddFoodItem = () => {
    navigate(`${path.FOOD_ITEM}/add`);
  };

  const handleEditFoodItem = (id: string) => {
    navigate(`${path.FOOD_ITEM}/edit/${id}`);
  };

  const columns: TableColumn[] = [
    { field: 'name', headerName: 'Name', sorting: true },
    { field: 'calories', headerName: 'Calories', sorting: true },
    { field: 'protein', headerName: 'Protein(g)', sorting: true },
    { field: 'carbs', headerName: 'Carbohydrates(g)', sorting: true },
    { field: 'fat', headerName: 'Fat(g)', sorting: true },
  ];

  return (
    <div>
      <h1>Food Item List</h1>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          value={searchTerm}
          onChange={handleSearchChange}
          label="Search Food Item"
          variant="outlined"
          sx={{ width: '300px' }}
        />
        <Button variant="contained" color="primary" onClick={handleAddFoodItem}>
          Add Food Item
        </Button>
      </Box>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable
          columns={columns}
          data={foodItems.map((item: any) => ({
            id: item._id,
            name: item.name,
            calories: item.calories,
            protein: item?.macronutrients?.proteins,
            carbs: item?.macronutrients?.carbohydrates,
            fat: item?.macronutrients?.fats,
          }))}
          onSort={handleSort}
          totalCount={totalCount}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          handleEdit={handleEditFoodItem}
          handleDelete={handleDeleteClick}
        />
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this food item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <SnackAlert
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        type={`success`}
        message={`Record deleted successfully`}
      />
    </div>
  );
};

export default FoodItemList;
