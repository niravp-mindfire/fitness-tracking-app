import React, { useEffect, useState } from 'react';
import {
  fetchNutritionMeals,
  deleteNutritionMeal,
} from '../../features/nutritionMeal/nutritionMealSlice';
import DataTable from '../../component/Datatable';
import { RootState, useAppDispatch, useAppSelector } from '../../app/store';
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
import NutritionMealModal from './NutritionMealForm';
import SnackAlert from '../../component/SnackAlert';

const NutritionMealList = () => {
  const dispatch = useAppDispatch();
  const { nutritionMeals, totalCount, loading } = useAppSelector(
    (state: RootState) => state.nutritionMeal,
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  useEffect(() => {
    getAllData();
  }, [dispatch, page, rowsPerPage, sortBy, sortOrder, search]);

  const getAllData = () => {
    dispatch(
      fetchNutritionMeals({
        page: page + 1,
        limit: rowsPerPage,
        search,
        sort: sortBy,
        order: sortOrder as 'asc' | 'desc',
      }),
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSort = (field: string, order: 'asc' | 'desc') => {
    setSortBy(field);
    setSortOrder(order);
    getAllData();
  };

  const handleDeleteNutritionMeal = (id: string) => {
    setDeleteId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await dispatch(deleteNutritionMeal(deleteId));
      setDialogOpen(false);
      setDeleteId(null);
      getAllData();
      setSnackbarOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDeleteId(null);
  };

  const columns = [
    { field: 'mealType', headerName: 'Meal Type', sorting: true },
    { field: 'totalCalories', headerName: 'Calories', sorting: true },
    { field: 'createdAt', headerName: 'Created At', sorting: true },
  ];

  const tableData = nutritionMeals?.map((meal: any) => ({
    id: meal._id,
    mealType: meal.mealType,
    totalCalories: meal.totalCalories,
    createdAt: meal?.createdAt
      ? new Date(meal?.createdAt).toLocaleDateString()
      : '-',
  }));

  const handleEditNutritionMeal = (id: any) => {
    // navigate(`${path.NUTRITION_MEAL}/edit/${id}`);
    setEditId(id);
    setOpen(true);
  };

  const handleCloseModal = (type = false) => {
    setOpen(false);
    setEditId(undefined);
    if (type) {
      getAllData();
    }
  };

  return (
    <div>
      <h1>Nutrition Meal List</h1>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <TextField
          variant="outlined"
          label="Search"
          value={search}
          onChange={handleSearchChange}
          sx={{ width: '300px' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setOpen(true);
          }}
        >
          Add Nutrition Meal
        </Button>
      </Box>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable
          columns={columns}
          data={tableData}
          totalCount={totalCount}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onSort={handleSort}
          handleDelete={handleDeleteNutritionMeal}
          handleEdit={handleEditNutritionMeal}
        />
      )}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Delete Nutrition Meal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this nutrition meal? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <NutritionMealModal open={open} onClose={handleCloseModal} id={editId} />
      <SnackAlert
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        type={`success`}
        message={`Record deleted successfully`}
      />
    </div>
  );
};

export default NutritionMealList;
