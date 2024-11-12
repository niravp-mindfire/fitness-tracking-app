'use client';
import { apiUrl } from '@/utils/apiUrl';
import axiosInstance from '@/utils/axiosInstance';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import DataTable from './DataTable';
import { Workout } from '@/interfaces/interfaces';
import WorkoutForm from './WorkoutForm';

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formModel, setFormModel] = useState({
    isOpen: false,
    editId: '',
  });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

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
  }, [debouncedSearchTerm, sortField, sortOrder]);

  const getAllData = async (
    page = 1,
    limit = 10,
    search = debouncedSearchTerm,
    sort = sortField,
    order = sortOrder,
  ) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(apiUrl.WORKOUTS, {
        params: { page, limit, search, sort, order },
      });
      console.log(response);
      if (response?.status == 200 && response?.data?.data) {
        setWorkouts(response?.data?.data?.workouts);
        setTotalCount(response?.data?.data?.total);
      } else {
        setWorkouts([]);
        setTotalCount(0);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch workouts');
    }
    setLoading(false);
  };

  const handleSort = (field: any) => {
    if (field === sortField) {
      if (sortOrder === 'desc') {
        setSortOrder('asc');
      } else {
        setSortOrder('desc');
      }
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handlePageChange = (newPage: number) => {
    getAllData(newPage + 1, 10, debouncedSearchTerm, sortField, sortOrder);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteWorkout = (id: string) => {
    setDeleteId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      try {
        await axiosInstance.delete(`${apiUrl.WORKOUTS}/${deleteId}`);
        setDialogOpen(false);
        setDeleteId(null);
        getAllData(1, 10, debouncedSearchTerm, sortField, sortOrder);
        setSnackbarOpen(true);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || 'Failed to delete workout',
        );
      }
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDeleteId(null);
  };

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
            sx={{ width: 'auto', backgroundColor: '#0D47A1' }}
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
          <Button
            onClick={handleCloseDialog}
            className="text-primary"
            sx={{ backgroundColor: '#0D47A1' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            className="text-highlight"
            sx={{ backgroundColor: '#0D47A1' }}
          >
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
      {/* <SnackAlert
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        type="success"
        message="Record deleted successfully"
      /> */}
    </div>
  );
};

export default WorkoutList;
