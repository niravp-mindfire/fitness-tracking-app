import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  fetchWorkoutExercises,
  deleteWorkoutExercise,
} from '../../features/workoutExercise/workoutExerciseSlice';
import DataTable from '../../component/Datatable';
import { RootState, useAppDispatch } from '../../app/store';
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
import { useNavigate } from 'react-router-dom';
import SnackAlert from '../../component/SnackAlert';

const WorkoutExerciseList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { workoutExercises, totalCount, loading } = useSelector(
    (state: RootState) => state.workoutExercise,
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  useEffect(() => {
    getAllData();
  }, [dispatch, page, rowsPerPage, sortBy, sortOrder, search]);

  const getAllData = () => {
    dispatch(
      fetchWorkoutExercises({
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

  const handleSearch = () => {
    getAllData();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSort = (field: string, order: 'asc' | 'desc') => {
    setSortBy(field);
    setSortOrder(order);
    getAllData();
  };

  const handleDeleteWorkoutExercise = (id: string) => {
    setDeleteId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await dispatch(deleteWorkoutExercise(deleteId));
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
    { field: 'workoutId', headerName: 'Workout', sorting: true },
    { field: 'exerciseId', headerName: 'Exercise', sorting: true },
    { field: 'sets', headerName: 'Sets', sorting: true },
    { field: 'reps', headerName: 'Reps', sorting: true },
    { field: 'weight', headerName: 'Weight (kg)', sorting: true },
  ];

  const tableData = workoutExercises?.map((workoutExercise: any) => ({
    id: workoutExercise._id,
    workoutId: `Duration: ${workoutExercise?.workoutId?.duration} - Date: ${new Date(workoutExercise?.workoutId?.date).toDateString()}`, // Ensure this is a string
    exerciseId: workoutExercise?.exerciseId?.name, // Ensure this is a string
    sets: workoutExercise?.sets,
    reps: workoutExercise?.reps,
    weight: workoutExercise?.weight,
  }));

  const handleEditWorkout = (id: any) => {
    navigate(`${path.WORKOUT_EXERCISE}/edit/${id}`);
  };

  return (
    <div>
      <h1>Workout Exercise List</h1>
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
          onClick={() => navigate(`${path.WORKOUT_EXERCISE}/add`)}
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
          totalCount={totalCount}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onSort={handleSort}
          handleDelete={handleDeleteWorkoutExercise}
          handleEdit={handleEditWorkout}
        />
      )}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Delete Workout Exercise</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this workout exercise? This action
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
      <SnackAlert
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        type={`success`}
        message={`Record deleted successfully`}
      />
    </div>
  );
};

export default WorkoutExerciseList;
