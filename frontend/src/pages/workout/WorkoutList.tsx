import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchWorkouts, selectAllWorkouts, selectWorkoutLoading, selectTotalWorkouts, updateSort, deleteWorkout } from '../../features/workout/workoutSlice';
import DataTable from '../../component/Datatable';
import { Workout } from '../../utils/types';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { path } from '../../utils/path';

const WorkoutList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const workouts = useAppSelector(selectAllWorkouts);
  const loading = useAppSelector(selectWorkoutLoading);
  const totalCount = useAppSelector(selectTotalWorkouts);
  const sortField = useAppSelector((state) => state.workout.sort);
  const sortOrder = useAppSelector((state) => state.workout.order);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Only fetch data when search term, sort field, or order changes
  useEffect(() => {
    dispatch(fetchWorkouts({ page: 1, limit: 10, search: searchTerm, sort: sortField, order: sortOrder }));
  }, [dispatch, searchTerm, sortField, sortOrder]);

  const handleSort = useCallback(
    (field: any) => {
      dispatch(updateSort(field));
    },
    [dispatch]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      dispatch(fetchWorkouts({ page: newPage + 1, limit: 10, search: searchTerm, sort: sortField, order: sortOrder }));
    },
    [dispatch, searchTerm, sortField, sortOrder]
  );

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleAddWorkout = useCallback(() => {
    navigate(`${path.WORKOUT}/add`);
  }, [navigate]);

  const handleEditWorkout = useCallback(
    (id: any) => {
      navigate(`${path.WORKOUT}/edit/${id}`);
    },
    [navigate]
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
      dispatch(fetchWorkouts({ page: 1, limit: 10, search: searchTerm, sort: sortField, order: sortOrder }));
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
    []
  );

  const tableData = useMemo(
    () =>
      workouts.map((workout: Workout) => ({
        id: workout._id,
        date: new Date(workout.date).toLocaleDateString(),
        duration: workout.duration,
        notes: workout.notes,
      })),
    [workouts]
  );

  return (
    <div>
      <h1>Workout List</h1>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <TextField
          variant="outlined"
          label="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: '300px' }}
        />
        <Button variant="contained" color="primary" onClick={handleAddWorkout}>
          Add Workout
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
          handleEdit={handleEditWorkout}
          handleDelete={handleDeleteWorkout}
        />
      )}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Delete Workout</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this workout? This action cannot be undone.</DialogContentText>
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
    </div>
  );
};

export default React.memo(WorkoutList);
