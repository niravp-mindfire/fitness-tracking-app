import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchWorkouts,
  selectAllWorkouts,
  selectWorkoutLoading,
  selectTotalWorkouts,
  updateSort,
  deleteWorkout,
} from '../../features/workout/workoutSlice';
import DataTable from '../../component/Datatable';
import { Workout } from '../../utils/types';
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
import SnackAlert from '../../component/SnackAlert';
import WorkoutForm from './WorkoutForm';

const WorkoutList = () => {
  const dispatch = useAppDispatch();
  const workouts = useAppSelector(selectAllWorkouts);
  const loading = useAppSelector(selectWorkoutLoading);
  const totalCount = useAppSelector(selectTotalWorkouts);
  const sortField = useAppSelector((state) => state.workout.sort);
  const sortOrder = useAppSelector((state) => state.workout.order);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
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
      fetchWorkouts({
        page: 1,
        limit: 10,
        search: searchTerm,
        sort: sortField,
        order: sortOrder,
      }),
    );
  };

  const handleSort = useCallback(
    (field: any) => {
      dispatch(updateSort(field));
    },
    [dispatch],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      dispatch(
        fetchWorkouts({
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

  const handleDeleteWorkout = useCallback((id: string) => {
    setDeleteId(id);
    setDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (deleteId) {
      await dispatch(deleteWorkout(deleteId));
      setDialogOpen(false);
      setDeleteId(null);
      dispatch(
        fetchWorkouts({
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
      { field: 'duration', headerName: 'Duration', sorting: true },
      { field: 'notes', headerName: 'Notes', sorting: false },
    ],
    [],
  );

  const tableData = useMemo(
    () =>
      workouts.map((workout: Workout) => ({
        id: workout._id,
        date: new Date(workout.date).toLocaleDateString(),
        duration: workout.duration,
        notes: workout.notes,
      })),
    [workouts],
  );

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
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <h1>Workout List</h1>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          variant="outlined"
          label="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6} container justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setFormModel({ isOpen: true, editId: '' })}
        >
          Add Workout
        </Button>
      </Grid>
      <Grid item xs={12}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            <DataTable
              columns={columns}
              data={tableData}
              onSort={handleSort}
              onPageChange={handlePageChange}
              totalCount={totalCount}
              rowsPerPage={10}
              handleEdit={(id) => {
                setFormModel({
                  isOpen: true,
                  editId: id,
                });
              }}
              handleDelete={handleDeleteWorkout}
            />
          </Box>
        )}
      </Grid>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Delete Workout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this workout? This action cannot be
            undone.
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
      <WorkoutForm
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
    </Grid>
  );
};

export default React.memo(WorkoutList);
