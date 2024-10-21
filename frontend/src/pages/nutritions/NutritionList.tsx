import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector, useDebounce } from '../../app/hooks';
import {
  fetchNutritionEntries,
  selectAllNutritionEntries,
  selectNutritionLoading,
  selectTotalNutritionEntries,
  updateSort,
  deleteNutrition,
} from '../../features/nutrition/nutritionSlice';
import DataTable from '../../component/Datatable';
import { Nutrition } from '../../utils/types';
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
  Grid,
} from '@mui/material';
import NutritionForm from './NutritionForm';
import SnackAlert from '../../component/SnackAlert';

const NutritionList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Selectors
  const nutritions = useAppSelector(selectAllNutritionEntries);
  const loading = useAppSelector(selectNutritionLoading);
  const totalCount = useAppSelector(selectTotalNutritionEntries);
  const sortField = useAppSelector((state) => state.nutrition.sort);
  const sortOrder = useAppSelector((state) => state.nutrition.order);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editNutritionId, setEditNutritionId] = useState<string | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Use the hook with a 300ms delay

  // Fetch all nutrition entries
  const fetchNutritions = useCallback(() => {
    dispatch(
      fetchNutritionEntries({
        page: 1,
        limit: 10,
        search: debouncedSearchTerm, // Use debounced search term
        sort: sortField,
        order: sortOrder,
      }),
    );
  }, [dispatch, debouncedSearchTerm, sortField, sortOrder]);

  // Effect to fetch data when dependencies change
  useEffect(() => {
    fetchNutritions();
  }, [fetchNutritions]);

  // Handlers
  const handleSort = (field: string) => {
    dispatch(updateSort(field));
  };

  const handlePageChange = (newPage: number) => {
    dispatch(
      fetchNutritionEntries({
        page: newPage + 1,
        limit: 10,
        search: debouncedSearchTerm,
        sort: sortField,
        order: sortOrder,
      }),
    );
  };

  const handleDeleteNutrition = (id: string) => {
    setDeleteId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await dispatch(deleteNutrition(deleteId));
      setDialogOpen(false);
      setDeleteId(null);
      fetchNutritions();
      setSnackbarOpen(true);
    }
  };

  const handleEditNutrition = (id: string) => {
    setEditNutritionId(id);
    setModalOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDeleteId(null);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditNutritionId(undefined);
    fetchNutritions(); // Re-fetch data on modal close
  };

  const columns = useMemo(
    () => [
      { field: 'date', headerName: 'Date', sorting: true },
      { field: 'notes', headerName: 'Notes', sorting: false },
      { field: 'createdAt', headerName: 'Created At', sorting: true },
    ],
    [],
  );

  const tableData = useMemo(
    () =>
      nutritions?.map((nutrition: Nutrition) => ({
        id: nutrition._id,
        date: new Date(nutrition.date).toLocaleDateString(),
        notes: nutrition.notes,
        createdAt: nutrition?.createdAt
          ? new Date(nutrition.createdAt).toLocaleDateString()
          : '-',
      })),
    [nutritions],
  );

  return (
    <div>
      <h1>Nutrition List</h1>
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={() => setModalOpen(true)}>
              Add Nutrition
            </Button>
          </Grid>
        </Grid>
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
          handleEdit={handleEditNutrition}
          handleDelete={(id) => {
            setDeleteId(id);
            setDialogOpen(true);
          }}
        />
      )}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Delete Nutrition</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this nutrition entry? This action
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
      <NutritionForm
        open={modalOpen}
        onClose={handleCloseModal}
        id={editNutritionId}
      />
      <SnackAlert
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        type="success"
        message="Nutrition entry deleted successfully"
      />
    </div>
  );
};

export default NutritionList;
