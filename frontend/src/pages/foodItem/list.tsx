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
  Typography,
  CircularProgress,
} from '@mui/material';
import { useAppDispatch, useAppSelector, useDebounce } from '../../app/hooks';
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

  // Debounce search term with a delay of 500ms
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    getAllData();
  }, [dispatch, debouncedSearchTerm, page, rowsPerPage, orderBy, order]);

  const getAllData = () => {
    // Only fetch data if the search term has at least 3 characters

    dispatch(
      fetchFoodItems({
        search: debouncedSearchTerm,
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
      dispatch(deleteFoodItem(selectedFoodItemId)).then(() => {
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
    <div className="container mx-auto mt-8 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 col-span-full">
          Food Item List
        </h1>
        <div className="col-span-1 sm:col-span-1">
          <TextField
            variant="outlined"
            label="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth // Make TextField full width
            sx={{ backgroundColor: '#EBF2FA' }}
          />
        </div>
        <div className="col-span-1 sm:col-span-1 flex justify-end">
          <Button
            variant="contained"
            color="primary"
            className="bg-primary hover:bg-secondary text-white shadow-md"
            sx={{ width: 'auto' }}
            onClick={() => setFormModel({ isOpen: true, editId: '' })}
          >
            Add Food Item
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress />
          </div>
        ) : (
          <div className="max-h-96 overflow-auto">
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
          </div>
        )}
      </div>
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
