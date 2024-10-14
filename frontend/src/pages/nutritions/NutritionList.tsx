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
} from '@mui/material';
import { path } from '../../utils/path';
import NutritionForm from './NutritionForm';
import SnackAlert from '../../component/SnackAlert';

const NutritionList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const nutritions: any = useAppSelector(selectAllNutritionEntries);
  const loading = useAppSelector(selectNutritionLoading);
  const totalCount: number = useAppSelector(selectTotalNutritionEntries);
  const sortField = useAppSelector((state) => state.nutrition.sort);
  const sortOrder = useAppSelector((state) => state.nutrition.order);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editNutrition, setEditNutrition] = useState<string | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = (type = false) => {
    setOpenModal(false);
    setEditNutrition(undefined);
    if (type) {
      getAllNutritions();
    }
  };
  const getAllNutritions = () => {
    dispatch(
      fetchNutritionEntries({
        page: 1,
        limit: 10,
        search: searchTerm,
        sort: sortField,
        order: sortOrder,
      }),
    );
  };
  // Fetch data when search term, sort field, or order changes
  useEffect(() => {
    getAllNutritions();
  }, [dispatch, searchTerm, sortField, sortOrder]);

  const handleSort = useCallback(
    (field: any) => {
      dispatch(updateSort(field));
    },
    [dispatch],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      dispatch(
        fetchNutritionEntries({
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

  const handleEditNutrition = (id: any) => {
    setEditNutrition(id);
    handleOpenModal();
  };

  const handleDeleteNutrition = useCallback((id: string) => {
    setDeleteId(id);
    setDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (deleteId) {
      await dispatch(deleteNutrition(deleteId));
      setDialogOpen(false);
      setDeleteId(null);
      dispatch(
        fetchNutritionEntries({
          page: 1,
          limit: 10,
          search: searchTerm,
          sort: sortField,
          order: sortOrder,
        }),
      );
      setSnackbarOpen(true);
    }
  }, [deleteId, dispatch, searchTerm, sortField, sortOrder]);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setDeleteId(null);
  }, []);

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
          ? new Date(nutrition?.createdAt).toLocaleDateString()
          : '-',
      })),
    [nutritions],
  );

  return (
    <div>
      <h1>Nutrition List</h1>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <TextField
          variant="outlined"
          label="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: '300px' }}
        />
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Add Nutrition
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
          handleEdit={handleEditNutrition}
          handleDelete={handleDeleteNutrition}
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
        id={editNutrition}
        open={openModal}
        onClose={handleCloseModal}
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

export default React.memo(NutritionList);
