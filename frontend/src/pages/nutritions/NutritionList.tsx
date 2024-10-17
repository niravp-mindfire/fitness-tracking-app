import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
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

  // Fetch all nutrition entries
  const fetchNutritions = useCallback(() => {
    dispatch(
      fetchNutritionEntries({
        page: 1,
        limit: 10,
        search: searchTerm,
        sort: sortField,
        order: sortOrder,
      }),
    );
  }, [dispatch, searchTerm, sortField, sortOrder]);

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
        search: searchTerm,
        sort: sortField,
        order: sortOrder,
      }),
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const openEditModal = (id: string) => {
    setEditNutritionId(id);
    setModalOpen(true);
  };

  const confirmDeleteNutrition = () => {
    if (deleteId) {
      dispatch(deleteNutrition(deleteId)).then(() => {
        fetchNutritions();
        setSnackbarOpen(true);
      });
      setDialogOpen(false);
      setDeleteId(null);
    }
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
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <h1>Nutrition List</h1>
      </Grid>
      <Grid item xs={12} sm={6} md={8}>
        <TextField
          variant="outlined"
          label="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} container justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalOpen(true)}
        >
          Add Nutrition
        </Button>
      </Grid>
      <Grid item xs={12}>
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
            handleEdit={openEditModal}
            handleDelete={(id) => {
              setDeleteId(id);
              setDialogOpen(true);
            }}
          />
        )}
      </Grid>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Delete Nutrition Entry</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this nutrition entry? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteNutrition} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <NutritionForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        id={editNutritionId}
      />
      <SnackAlert
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        type="success"
        message="Record deleted successfully"
      />
    </Grid>
  );
};

export default React.memo(NutritionList);
