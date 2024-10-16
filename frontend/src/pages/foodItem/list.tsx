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
  Grid,
  Stack,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchFoodItems,
  deleteFoodItem,
} from '../../features/foodItem/foodItem';
import DataTable from '../../component/Datatable';
import { TableColumn } from '../../utils/types';
import { useNavigate } from 'react-router-dom';
import SnackAlert from '../../component/SnackAlert';
import FoodItemForm from './form';

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
  const [formModel, setFormModel] = useState({
    isOpen: false,
    editId: '',
  });

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
    setFormModel({
      isOpen: true,
      editId: '',
    });
  };

  const handleEditFoodItem = (id: string) => {
    setFormModel({
      isOpen: true,
      editId: id,
    });
  };

  const columns: TableColumn[] = [
    { field: 'name', headerName: 'Name', sorting: true },
    { field: 'calories', headerName: 'Calories', sorting: true },
    { field: 'protein', headerName: 'Protein(g)', sorting: true },
    { field: 'carbs', headerName: 'Carbohydrates(g)', sorting: true },
    { field: 'fat', headerName: 'Fat(g)', sorting: true },
  ];

  const handleClose = (fetch: boolean) => {
    setFormModel({
      isOpen: false,
      editId: '',
    });
    if (fetch) {
      getAllData();
    }
  };

  return (
    <div>
      <h1>Food Item List</h1>
      <Stack spacing={2} mb={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8} md={6}>
            <TextField
              value={searchTerm}
              onChange={handleSearchChange}
              label="Search Food Item"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4} md={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddFoodItem}
            >
              Add Food Item
            </Button>
          </Grid>
        </Grid>
      </Stack>

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
      <FoodItemForm
        open={formModel?.isOpen}
        onClose={handleClose}
        id={formModel?.editId}
      />
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
