import React, { useEffect, useState } from 'react';
import {
  fetchProgressTrackings,
  deleteProgressTracking,
} from '../../features/progressTracking/progressTrackingSlice';
import DataTable from '../../component/Datatable';
import { RootState, useAppDispatch, useAppSelector } from '../../app/store';
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import ProgressTrackingModal from './ProgressTrackingDialog';
import SnackAlert from '../../component/SnackAlert';

const ProgressTrackingList = () => {
  const dispatch = useAppDispatch();
  const { progressTrackings, totalCount, loading } = useAppSelector(
    (state: RootState) => state.progressTracking,
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | undefined>();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  useEffect(() => {
    getAllData();
  }, [dispatch, page, rowsPerPage, sortBy, sortOrder, search]);

  const getAllData = () => {
    dispatch(
      fetchProgressTrackings({
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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSort = (field: string, order: 'asc' | 'desc') => {
    setSortBy(field);
    setSortOrder(order);
    getAllData();
  };

  const handleDeleteProgressTracking = (id: string) => {
    setDeleteId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await dispatch(deleteProgressTracking(deleteId));
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
    { field: 'date', headerName: 'Date', sorting: true },
    { field: 'weight', headerName: 'Weight', sorting: true },
    { field: 'bodyFatPercentage', headerName: 'Body Fat(%)', sorting: true },
    { field: 'muscleMass', headerName: 'Muscle Mass', sorting: true },
    { field: 'notes', headerName: 'Notes', sorting: true },
    { field: 'createdAt', headerName: 'Created At', sorting: true },
  ];

  const tableData = progressTrackings?.map((tracking: any) => ({
    id: tracking._id,
    date: tracking?.date ? new Date(tracking?.date).toLocaleDateString() : '-',
    weight: tracking.weight,
    bodyFatPercentage: tracking.bodyFatPercentage,
    muscleMass: tracking.muscleMass,
    notes: tracking.notes,
    createdAt: tracking?.createdAt
      ? new Date(tracking?.createdAt).toLocaleDateString()
      : '-',
  }));

  const handleEditProgressTracking = (id: any) => {
    setEditId(id);
    setOpen(true);
  };

  const handleCloseModal = (type = false) => {
    setOpen(false);
    setEditId(undefined);
    if (type) {
      getAllData();
    }
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 col-span-full">
          Progress Tracking List
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
            sx={{ width: 'auto' }}
            onClick={() => setOpen(true)}
          >
            Add Progress
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
              totalCount={totalCount}
              rowsPerPage={rowsPerPage}
              onPageChange={handlePageChange}
              onSort={handleSort}
              handleDelete={handleDeleteProgressTracking}
              handleEdit={handleEditProgressTracking}
            />
          </div>
        )}
      </div>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Delete Progress Tracking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this progress tracking? This action
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
      <ProgressTrackingModal
        open={open}
        onClose={handleCloseModal}
        id={editId}
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

export default ProgressTrackingList;
