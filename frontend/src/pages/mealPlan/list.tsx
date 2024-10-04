import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchMealPlans,
  selectAllMealPlans,
  selectMealPlanLoading,
  selectTotalMealPlans,
  updateSort,
  deleteMealPlan,
} from '../../features/mealPlan/mealPlanSlice';
import DataTable from '../../component/Datatable';
import { MealPlan } from '../../utils/types';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { path } from '../../utils/path';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Plus icon
import ExpandLessIcon from '@mui/icons-material/ExpandLess'; // Minus icon

const MealPlanList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const mealPlans = useAppSelector(selectAllMealPlans);
  const loading = useAppSelector(selectMealPlanLoading);
  const totalCount = useAppSelector(selectTotalMealPlans);
  const sortField = useAppSelector((state) => state.mealPlan.sort);
  const sortOrder = useAppSelector((state) => state.mealPlan.order);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<string[]>([]); // Track expanded rows

  useEffect(() => {
    dispatch(fetchMealPlans({ page: 1, limit: 10, search: searchTerm, sort: sortField, order: sortOrder }));
  }, [dispatch, searchTerm, sortField, sortOrder]);

  const handleSort = useCallback((field: string) => {
    dispatch(updateSort(field));
  }, [dispatch]);

  const handlePageChange = useCallback((newPage: number) => {
    dispatch(fetchMealPlans({ page: newPage + 1, limit: 10, search: searchTerm, sort: sortField, order: sortOrder }));
  }, [dispatch, searchTerm, sortField, sortOrder]);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleAddMealPlan = useCallback(() => {
    navigate(`${path.MEAL_PLAN}/add`);
  }, [navigate]);

  const handleEditMealPlan = useCallback((id: string) => {
    navigate(`${path.MEAL_PLAN}/edit/${id}`);
  }, [navigate]);

  const handleDeleteMealPlan = useCallback((id: string) => {
    setDeleteId(id);
    setDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (deleteId) {
      await dispatch(deleteMealPlan(deleteId));
      setDialogOpen(false);
      setDeleteId(null);
      dispatch(fetchMealPlans({ page: 1, limit: 10, search: searchTerm, sort: sortField, order: sortOrder }));
    }
  }, [deleteId, dispatch, searchTerm, sortField, sortOrder]);

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
    []
  );

  const tableData = useMemo(
    () =>
      mealPlans.map((mealPlan: MealPlan) => ({
        id: mealPlan._id,
        title: mealPlan.title,
        description: mealPlan.description,
        createdAt: new Date(mealPlan.createdAt).toLocaleDateString(),
        meals: mealPlan.meals, // Pass the meals data for expandable rows
      })),
    [mealPlans]
  );

  const renderExpandableRow = (mealPlan: MealPlan) => {
    const meals = mealPlan.meals || []; // Fetch the meals related to this meal plan

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Meal Type</TableCell>
            <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Food Item</TableCell>
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
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <h1>Meal Plan List</h1>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <TextField
          variant="outlined"
          label="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: '300px' }}
        />
        <Button variant="contained" color="primary" onClick={handleAddMealPlan}>
          Add Meal Plan
        </Button>
      </Box>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable
          columns={columns}
          data={tableData}
          onSort={handleSort}
          onPageChange={handlePageChange}
          totalCount={totalCount}
          rowsPerPage={10}
          handleEdit={handleEditMealPlan}
          handleDelete={handleDeleteMealPlan}
          expandable={true}
          expandedRows={expandedRows}
          toggleRow={toggleRow}
          renderExpandableRow={renderExpandableRow}
        />
      )}
      
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this meal plan?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MealPlanList;
