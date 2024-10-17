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
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchWorkoutExercises,
  deleteWorkoutExercise,
} from '../../features/workoutExercise/workoutExerciseSlice';
import DataTable from '../../component/Datatable';
import { TableColumn } from '../../utils/types';
import SnackAlert from '../../component/SnackAlert';
import WorkoutExerciseForm from './WorkoutExerciseForm';

const WorkoutExerciseList: React.FC = () => {
  const dispatch = useAppDispatch();

  const { workoutExercises, totalCount, loading } = useAppSelector(
    (state) => state.workoutExercise,
  );

  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [formModel, setFormModel] = useState({
    isOpen: false,
    editId: '',
  });

  useEffect(() => {
    getAllData();
  }, [dispatch, search, page, rowsPerPage, sortBy, sortOrder]);

  const getAllData = () => {
    dispatch(
      fetchWorkoutExercises({
        page: page + 1,
        limit: rowsPerPage,
        search,
        sort: sortBy,
        order: sortOrder,
      }),
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
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

  const columns: TableColumn[] = [
    { field: 'workoutId', headerName: 'Workout', sorting: true },
    { field: 'exerciseId', headerName: 'Exercise', sorting: true },
    { field: 'sets', headerName: 'Sets', sorting: true },
    { field: 'reps', headerName: 'Reps', sorting: true },
    { field: 'weight', headerName: 'Weight (kg)', sorting: true },
  ];

  const tableData = workoutExercises?.map((workoutExercise: any) => ({
    id: workoutExercise._id,
    workoutId: `Duration: ${workoutExercise?.workoutId?.duration} - Date: ${new Date(workoutExercise?.workoutId?.date).toDateString()}`,
    exerciseId: workoutExercise?.exerciseId?.name,
    sets: workoutExercise?.sets,
    reps: workoutExercise?.reps,
    weight: workoutExercise?.weight,
  }));

  const handleEditWorkout = (id: any) => {
    setFormModel({
      isOpen: true,
      editId: id,
    });
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
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <h1>Workout Exercise List</h1>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          variant="outlined"
          label="Search"
          value={search}
          onChange={handleSearchChange}
          fullWidth // Make TextField full width
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
              totalCount={totalCount}
              rowsPerPage={rowsPerPage}
              onPageChange={handlePageChange}
              onSort={handleSort}
              handleDelete={handleDeleteWorkoutExercise}
              handleEdit={handleEditWorkout}
            />
          </Box>
        )}
      </Grid>
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
      <WorkoutExerciseForm
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

export default WorkoutExerciseList;
