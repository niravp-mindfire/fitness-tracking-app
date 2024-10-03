import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    dispatch(fetchWorkouts({ page: 1, limit: 10, sort: sortField, order: sortOrder }));
  }, [dispatch, sortField, sortOrder]);

  const handleSort = (field: any) => {
    dispatch(updateSort(field)); // Only pass the field to toggle the order
    dispatch(fetchWorkouts({ page: 1, limit: 10, sort: field, order: sortOrder }));
  };

  const handlePageChange = (newPage: number) => {
    dispatch(fetchWorkouts({ page: newPage + 1, limit: 10, sort: sortField, order: sortOrder }));
  };

  const handleSearch = (searchTerm: string) => {
    dispatch(fetchWorkouts({ page: 1, limit: 10, search: searchTerm, sort: sortField, order: sortOrder }));
  };

  const handleAddWorkout = () => {
    navigate(`${path.WORKOUT}/add`);
  };

  const handleEditWorkout = (id: any) => {
    navigate(`${path.WORKOUT}/edit/${id}`);
  };

  const handleDeleteWorkout = (id: string) => {
    setDeleteId(id); // Set the workout ID to delete
    setDialogOpen(true); // Open the confirmation dialog
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await dispatch(deleteWorkout(deleteId));
      setDialogOpen(false); // Close dialog after deletion
      setDeleteId(null); // Clear the deleteId
      dispatch(fetchWorkouts({ page: 1, limit: 10, sort: sortField, order: sortOrder }));
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDeleteId(null); // Reset the selected delete ID
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    handleSearch(event.target.value);
  };

  const columns = [
    { field: 'date', headerName: 'Date', sorting: true },
    { field: 'duration', headerName: 'Duration', sorting: true },
    { field: 'notes', headerName: 'Notes', sorting: false },
  ];

  const tableData = workouts.map((workout: Workout) => ({
    id: workout._id,
    date: new Date(workout.date).toLocaleDateString(),
    duration: workout.duration,
    notes: workout.notes,
  }));

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
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddWorkout}
        >
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

export default WorkoutList;
