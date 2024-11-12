'use client';
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
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axiosInstance';
import { apiUrl } from '@/utils/apiUrl';
import DataTable from './DataTable';
import WorkoutPlanForm from './WorkoutPlanForm';

const WorkoutPlanList = () => {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formModel, setFormModel] = useState({
    isOpen: false,
    editId: '',
  });

  useEffect(() => {
    getAllData();
  }, [page, rowsPerPage, sortBy, sortOrder, search]);

  const getAllData = () => {
    fetchWorkoutPlans({
      page: page + 1,
      limit: rowsPerPage,
      search,
      sort: sortBy,
      order: sortOrder as 'asc' | 'desc',
    });
  };

  const fetchWorkoutPlans = async ({
    page,
    limit,
    search,
    sort,
    order,
  }: any) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(apiUrl.WORKOUT_PLANS, {
        params: { page, limit, search, sort, order },
      });
      if (response.status == 200) {
        setWorkoutPlans(response.data.data.workoutPlans);
        setTotalCount(response.data.data.total);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to fetch workout plans',
      );
    }
    setLoading(false);
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

  const handleDeleteWorkoutPlan = (id: string) => {
    setDeleteId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await axiosInstance.delete(`${apiUrl.WORKOUT_PLANS}/${deleteId}`);
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
    { field: 'name', headerName: 'Title', sorting: true },
    { field: 'description', headerName: 'Description', sorting: true },
    { field: 'duration', headerName: 'Duration (Weeks)', sorting: true },
    { field: 'createdAt', headerName: 'Created At', sorting: true },
  ];

  const tableData = workoutPlans?.map((plan: any) => ({
    id: plan._id,
    name: plan.title,
    description: plan.description,
    duration: plan.duration,
    createdAt: new Date(plan.createdAt).toDateString(),
  }));

  const handleEditWorkoutPlan = (id: any) => {
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
    <div className="container mx-auto mt-8 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 col-span-full">
          Workout Plan List
        </h1>
        <div className="col-span-1 sm:col-span-1">
          <TextField
            variant="outlined"
            label="Search"
            value={search}
            onChange={handleSearchChange}
            fullWidth // Make TextField full width
            sx={{ backgroundColor: '#EBF2FA' }}
          />
        </div>
        <div className="col-span-1 sm:col-span-1 flex justify-end">
          <Button
            variant="contained"
            color="primary"
            className="bg-primary hover:bg-secondary text-white shadow-md"
            sx={{ width: 'auto', backgroundColor: '#0D47A1' }}
            onClick={() => setFormModel({ isOpen: true, editId: '' })}
          >
            Add Workout Plan
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
              onSort={handleSort}
              onPageChange={handlePageChange}
              totalCount={totalCount}
              rowsPerPage={rowsPerPage}
              handleEdit={handleEditWorkoutPlan}
              handleDelete={handleDeleteWorkoutPlan}
            />
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this workout plan?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <WorkoutPlanForm
        open={formModel?.isOpen}
        onClose={handleClose}
        id={formModel?.editId}
      />
      {/* <SnackAlert
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        type={`success`}
        message={`Record Deleted Successfully`}
        /> */}
    </div>
  );
};

export default WorkoutPlanList;
