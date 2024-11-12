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
  CircularProgress,
} from '@mui/material';
import { useDebounce } from '@/hooks/useDebounce';
import axiosInstance from '@/utils/axiosInstance';
import { apiUrl } from '@/utils/apiUrl';
import { toast } from 'react-toastify';
import { TableColumn } from '@/interfaces/interfaces';
import DataTable from './DataTable';
import ChallengeForm from './ChallengeForm';

const ChallengeList: React.FC = () => {
  const [challenges, setChallenges] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('title');
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(
    null,
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formModel, setFormModel] = useState({
    isOpen: false,
    editId: '',
  });

  // Debounce search term with a delay of 500ms
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    getAllData();
  }, [debouncedSearchTerm, page, rowsPerPage, orderBy, order]);

  const getAllData = () => {
    fetchChallenges({
      search: debouncedSearchTerm,
      page: page + 1,
      limit: rowsPerPage,
      sort: orderBy,
      order,
    });
  };

  const fetchChallenges = async (params: {
    search: string;
    page: number;
    limit: number;
    sort: string;
    order: 'asc' | 'desc';
  }) => {
    try {
      const response = await axiosInstance.get(`${apiUrl.CHALLENGES}`, {
        params,
      });
      if (response.status == 200) {
        setChallenges(response.data.data.challenges);
        setTotalCount(response.data.data.total);
      }
    } catch (error: any) {
      toast.error(error.response.data);
    }
  };

  const handleSort = (field: string, newOrder: 'asc' | 'desc') => {
    setOrder(newOrder);
    setOrderBy(field);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedChallengeId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedChallengeId) {
      await axiosInstance.delete(`${apiUrl.CHALLENGES}/${selectedChallengeId}`);
    }
    setDialogOpen(false);
    setSnackbarOpen(true);
    getAllData();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleAddChallenge = () => {
    setFormModel({
      isOpen: true,
      editId: '',
    });
  };

  const handleEditChallenge = (id: string) => {
    setFormModel({
      isOpen: true,
      editId: id,
    });
  };

  const columns: TableColumn[] = [
    { field: 'title', headerName: 'Title', sorting: true },
    { field: 'description', headerName: 'Description', sorting: false },
    { field: 'startDate', headerName: 'Start Date', sorting: true },
    { field: 'endDate', headerName: 'End Date', sorting: true },
  ];

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
          Challenge List
        </h1>
        <div className="col-span-1 sm:col-span-1">
          <TextField
            variant="outlined"
            label="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
            sx={{ backgroundColor: '#EBF2FA' }}
          />
        </div>
        <div className="col-span-1 sm:col-span-1 flex justify-end">
          <Button
            variant="contained"
            color="primary"
            className="bg-primary hover:bg-secondary text-white shadow-md"
            sx={{ width: 'auto' }}
            onClick={handleAddChallenge}
          >
            Add Challenge
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
              data={challenges.map((challenge: any) => ({
                id: challenge._id,
                title: challenge.title,
                description: challenge.description,
                startDate: challenge?.startDate?.split('T')[0],
                endDate: challenge?.endDate?.split('T')[0],
              }))}
              onSort={handleSort}
              totalCount={totalCount}
              rowsPerPage={rowsPerPage}
              onPageChange={handlePageChange}
              handleEdit={handleEditChallenge}
              handleDelete={handleDeleteClick}
            />
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this challenge?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ChallengeForm
        open={formModel?.isOpen}
        onClose={handleClose}
        id={formModel?.editId}
      />
    </div>
  );
};

export default ChallengeList;
