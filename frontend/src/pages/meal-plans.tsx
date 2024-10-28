import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  fetchMealPlans,
  selectAllMealPlans,
  selectMealPlanLoading,
  selectTotalMealPlans,
  updateSort,
  deleteMealPlan,
} from '../features/mealPlan/mealPlanSlice';
import DataTable from '../components/Datatable';
import { MealPlan } from '../utils/types';
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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from '@mui/material';
import SnackAlert from '../components/SnackAlert';
import MealPlanForm from '../components/mealPlan/MealPlanForm';
import { useRouter } from 'next/router';
import Admin from './Admin';
import SEO from '../components/SEO';
import { seo } from '../utils/seo';

const MealPlanList = () => {
  const dispatch = useAppDispatch();
  const router = useRouter(); // Use useRouter for navigation
  const mealPlans = useAppSelector(selectAllMealPlans);
  const loading = useAppSelector(selectMealPlanLoading);
  const totalCount = useAppSelector(selectTotalMealPlans);
  const sortField = useAppSelector((state) => state.mealPlan.sort);
  const sortOrder = useAppSelector((state) => state.mealPlan.order);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formModel, setFormModel] = useState({
    isOpen: false,
    editId: '',
  });

  useEffect(() => {
    getAllData();
  }, [dispatch, searchTerm, sortField, sortOrder]);

  const getAllData = () => {
    dispatch(
      fetchMealPlans({
        page: 1,
        limit: 10,
        search: searchTerm,
        sort: sortField,
        order: sortOrder,
      }),
    );
  };

  const handleSort = useCallback(
    (field: string) => {
      dispatch(updateSort(field));
    },
    [dispatch],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      dispatch(
        fetchMealPlans({
          page: newPage + 1,
          limit: 10,
          search: searchTerm,
          sort: sortField,
          order: sortOrder,
        }),
      );
    },
    [dispatch, searchTerm, sortField, sortOrder],
  );

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    [],
  );

  const handleAddMealPlan = () => {
    setFormModel({
      isOpen: true,
      editId: '',
    });
  };

  const handleEditMealPlan = (id: string) => {
    setFormModel({
      isOpen: true,
      editId: id,
    });
  };

  const handleDeleteMealPlan = useCallback((id: string) => {
    setDeleteId(id);
    setDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (deleteId) {
      await dispatch(deleteMealPlan(deleteId));
      setDialogOpen(false);
      setDeleteId(null);
      getAllData();
      setSnackbarOpen(true);
    }
  }, [deleteId, dispatch]);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setDeleteId(null);
  }, []);

  const columns = useMemo(
    () => [
      { field: 'title', headerName: 'Title', sorting: true },
      { field: 'description', headerName: 'Description', sorting: true },
      { field: 'createdAt', headerName: 'Date', sorting: false },
    ],
    [],
  );

  const tableData = useMemo(
    () =>
      mealPlans.map((mealPlan: MealPlan) => ({
        id: mealPlan._id,
        title: mealPlan.title,
        description: mealPlan.description,
        createdAt: new Date(mealPlan.createdAt).toLocaleDateString(),
        meals: mealPlan.meals,
      })),
    [mealPlans],
  );

  const renderExpandableRow = (mealPlan: MealPlan) => {
    const meals = mealPlan.meals || [];

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
              Meal Type
            </TableCell>
            <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
              Food Item
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {meals.map((meal: any) => (
            <TableRow key={meal._id}>
              <TableCell>{meal.mealType}</TableCell>
              <TableCell>
                {meal.foodItems?.map((food: any) => (
                  <div key={food?.foodId?._id}>
                    Food: {food?.foodId?.name} - Qty: {food?.quantity}
                  </div>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const toggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

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
    <>
      <SEO
        title={seo?.mealPlan?.title}
        description={seo?.mealPlan?.description}
        keywords={seo?.mealPlan?.keywords?.join(',')}
      />
      <Admin>
        <div className="container mx-auto mt-8 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 col-span-full">
              Meal Plan List
            </h1>
            <div className="col-span-1 sm:col-span-1">
              <TextField
                variant="outlined"
                label="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                fullWidth
                sx={{ backgroundColor: '#EBF2FA' }}
              />
            </div>
            <div className="col-span-1 sm:col-span-1 flex justify-end">
              <Button
                variant="contained"
                color="primary"
                className="bg-primary hover:bg-secondary text-white shadow-md"
                sx={{ width: 'auto' }}
                onClick={handleAddMealPlan}
              >
                Add Meal Plan
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
                  data={tableData}
                  onSort={handleSort}
                  onPageChange={handlePageChange}
                  totalCount={totalCount}
                  rowsPerPage={10}
                  handleEdit={handleEditMealPlan}
                  handleDelete={handleDeleteMealPlan}
                  renderExpandableRow={renderExpandableRow} // Ensure expandable rows are rendered
                  expandedRows={expandedRows} // Pass expanded rows to DataTable
                  toggleRow={toggleRow} // Function to toggle expanded rows
                />
              </div>
            )}
          </div>
          <Dialog open={dialogOpen} onClose={handleCloseDialog}>
            <DialogTitle>Delete Meal Plan</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this meal plan? This action
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
          <MealPlanForm
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
      </Admin>
    </>
  );
};

export default React.memo(MealPlanList);
