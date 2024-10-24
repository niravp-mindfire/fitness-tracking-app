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
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  console.log(sortField, sortOrder, '=========here');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    getAllData();
  }, [dispatch, debouncedSearchTerm, sortField, sortOrder]);

  const getAllData = () => {
    dispatch(
      fetchWorkouts({
        page: 1,
        limit: 10,
        search: debouncedSearchTerm,
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
          search: debouncedSearchTerm,
          sort: sortField,
          order: sortOrder,
        }),
      );
    },
    [dispatch, debouncedSearchTerm, sortField, sortOrder],
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
          search: debouncedSearchTerm,
          sort: sortField,
          order: sortOrder,
        }),
      );
      setSnackbarOpen(true);
    }
  }, [deleteId, dispatch, debouncedSearchTerm, sortField, sortOrder]);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setDeleteId(null);
  }, []);

  const columns = useMemo(
    () => [
      { field: 'date', headerName: 'Date', sorting: true },
      { field: 'duration', headerName: 'Duration (Min)', sorting: true },
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
    <div className="container mx-auto mt-8 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 col-span-full">
          Workout List
        </h1>
        <div className="col-span-1 sm:col-span-1">
          <TextField
            variant="outlined"
            label="Search Workouts"
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
            sx={{ backgroundColor: '#EBF2FA' }}
          />
        </div>
        <div className="col-span-1 sm:col-span-1 flex justify-end">
          <Button
            variant="contained"
            className="bg-primary hover:bg-secondary text-white shadow-md"
            onClick={() => setFormModel({ isOpen: true, editId: '' })}
            sx={{ width: 'auto' }}
          >
            Add Workout
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
              sortField={sortField}
              sortOrder={sortOrder}
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
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Delete Workout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this workout? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} className="text-primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} className="text-highlight">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Workout Form Dialog */}
      <WorkoutForm
        open={formModel?.isOpen}
        onClose={handleClose}
        id={formModel?.editId}
      />

      {/* Snackbar for delete success */}
      <SnackAlert
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        type="success"
        message="Record deleted successfully"
      />
    </div>
  );
};

export default React.memo(WorkoutList);
