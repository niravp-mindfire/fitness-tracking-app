'use client';
import { useDebounce } from '@/hooks/useDebounce';
import { TableColumn } from '@/interfaces/interfaces';
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
import DataTable from './DataTable';
import axiosInstance from '@/utils/axiosInstance';
import { apiUrl } from '@/utils/apiUrl';
import { toast } from 'react-toastify';
import ExerciseForm from './ExerciseForm';

const ExercisesList: React.FC = () => {
  const [exercises, setExercises] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('name');
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(
    null,
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formModel, setFormModel] = useState({ isOpen: false, editId: '' });

  // Debounce search term with a delay of 500ms
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    getAllData();
  }, [debouncedSearchTerm, page, rowsPerPage, orderBy, order]);

  const getAllData = async (
    page = 1,
    limit = 10,
    search = debouncedSearchTerm,
    sort = orderBy,
    orderField = order,
  ) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(apiUrl.EXERCISES, {
        params: { page, limit, search, sort, order: orderField },
      });
      if (response?.status == 200) {
        console.log(response);
        setExercises(response?.data?.data?.exercises);
        setPage(response?.data?.data?.page);
        setTotalCount(response?.data?.data?.total);
        setRowsPerPage(response?.data?.data?.limit);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch exercises');
    }
    setLoading(false);
  };

  const handleSort = (field: string, newOrder: 'asc' | 'desc') => {
    if (field === orderBy) {
      if (order === 'desc') {
        setOrder('asc');
      } else {
        setOrder('desc');
      }
    } else {
      setOrderBy(field);
      setOrder('desc');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedExerciseId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedExerciseId) {
      // await dispatch(deleteExercise(selectedExerciseId));
      setSnackbarOpen(true);
    }
    setDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleAddExercise = () => {
    setFormModel({ isOpen: true, editId: '' });
  };

  const handleEditExercise = (id: string) => {
    setFormModel({ isOpen: true, editId: id });
  };

  const columns: TableColumn[] = [
    { field: 'name', headerName: 'Name', sorting: true },
    { field: 'type', headerName: 'Type', sorting: false },
    { field: 'category', headerName: 'Category', sorting: true },
    { field: 'description', headerName: 'Description', sorting: true },
  ];

  const tableData = useMemo(
    () =>
      exercises.map((exercise: any) => ({
        id: exercise._id,
        name: exercise.name,
        type: exercise.type,
        category: exercise?.category,
        description: exercise?.description,
      })),
    [exercises],
  );

  const handleClose = (fetch: boolean) => {
    setFormModel({ isOpen: false, editId: '' });
    if (fetch) {
      getAllData();
    }
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 col-span-full">
          Exercise List
        </h1>
        <div className="col-span-1 sm:col-span-1">
          <TextField
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            label="Search Exercise"
            variant="outlined"
            sx={{ backgroundColor: '#EBF2FA' }}
          />
        </div>
        <div className="col-span-1 sm:col-span-1 flex justify-end">
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleAddExercise}
            className="bg-primary hover:bg-secondary text-white shadow-md"
            sx={{ width: 'auto', backgroundColor: '#0D47A1' }}
          >
            Add Exercise
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
              totalCount={totalCount}
              rowsPerPage={rowsPerPage}
              onPageChange={handlePageChange}
              handleEdit={handleEditExercise}
              handleDelete={handleDeleteClick}
            />
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this exercise? This action cannot be
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

      {/* Exercise Form Dialog */}
      <ExerciseForm
        open={formModel.isOpen}
        onClose={handleClose}
        id={formModel.editId}
      />
    </div>
  );
};

export default ExercisesList;
