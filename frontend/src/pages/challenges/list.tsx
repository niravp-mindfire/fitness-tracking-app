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
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchChallenges,
  deleteChallenge,
} from '../../features/challenges/challenge';
import DataTable from '../../component/Datatable';
import { TableColumn } from '../../utils/types';
import { useNavigate } from 'react-router-dom';
import SnackAlert from '../../component/SnackAlert';
import ChallengeForm from './form';

const ChallengeList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { challenges, totalCount, loading } = useAppSelector(
    (state) => state.challenge,
  );

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

  useEffect(() => {
    getAllData();
  }, [dispatch, searchTerm, page, rowsPerPage, orderBy, order]);

  const getAllData = () => {
    dispatch(
      fetchChallenges({
        search: searchTerm,
        page: page + 1,
        limit: rowsPerPage,
        sort: orderBy,
        order,
      }),
    );
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

  const handleConfirmDelete = () => {
    if (selectedChallengeId) {
      dispatch(deleteChallenge(selectedChallengeId));
    }
    setDialogOpen(false);
    setSnackbarOpen(true);
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
    <Box padding={2}>
      <Typography variant="h4" gutterBottom>
        Challenge List
      </Typography>
      <Grid container spacing={2} mb={2} alignItems="center">
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            label="Search Challenge"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleAddChallenge}
          >
            Add Challenge
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : (
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
      )}

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
      <SnackAlert
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        type={`success`}
        message={`Record deleted successfully`}
      />
    </Box>
  );
};

export default ChallengeList;
