import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchExercises,
  deleteExercise,
} from "../../features/exercise/exerciseSlice";
import DataTable from "../../component/Datatable";
import { TableColumn } from "../../utils/types";
import { useNavigate } from "react-router-dom";
import { path } from "../../utils/path";

const ExerciseList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { exercises, totalCount, loading } = useAppSelector(
    (state) => state.exercise
  );

  // Local state for managing search, sort, pagination, and date filters
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("name");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(
    null
  );

  // Fetch exercises when component mounts or state changes
  useEffect(() => {
    getAllData();
  }, [
    dispatch,
    searchTerm,
    page,
    rowsPerPage,
    orderBy,
    order,
    startDate,
    endDate,
  ]);

  const getAllData = () => {
    dispatch(
      fetchExercises({
        search: searchTerm,
        page: page + 1, // Page numbers are 1-indexed in the backend
        limit: rowsPerPage,
        sort: orderBy,
        order,
        startDate,
        endDate,
      })
    );
  };

  // Handle sorting
  const handleSort = (field: string, newOrder: "asc" | "desc") => {
    setOrder(newOrder);
    setOrderBy(field);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handle delete confirmation dialog
  const handleDeleteClick = (id: string) => {
    setSelectedExerciseId(id);
    setDialogOpen(true);
  };

  // Confirm deletion
  const handleConfirmDelete = () => {
    if (selectedExerciseId) {
      dispatch(deleteExercise(selectedExerciseId));
    }
    setDialogOpen(false);
  };

  // Close delete confirmation dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Handle adding a new exercise
  const handleAddExercise = () => {
    navigate(`${path.EXERCISE}/add`);
  };

  // Handle editing an existing exercise
  const handleEditExercise = (id: string) => {
    navigate(`${path.EXERCISE}/edit/${id}`);
  };

  // Date filter submit
  const handleDateFilter = () => {
    setPage(0); // Reset page when applying filters
  };

  // Table columns definition
  const columns: TableColumn[] = [
    { field: "name", headerName: "Name", sorting: true },
    { field: "type", headerName: "Type", sorting: true },
    { field: "category", headerName: "Category", sorting: true },
    { field: "description", headerName: "Description", sorting: false },
  ];

  return (
    <div>
      <h1>Exercise List</h1>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          value={searchTerm}
          onChange={handleSearchChange}
          label="Search Exercise"
          variant="outlined"
          sx={{ width: "300px" }}
        />
        <Button variant="contained" color="primary" onClick={handleAddExercise}>
          Add Exercise
        </Button>
      </Box>

      {/* <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          type="date"
          label="Start Date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          type="date"
          label="End Date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button variant="contained" onClick={handleDateFilter}>
          Filter
        </Button>
      </Box> */}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable
          columns={columns}
          data={exercises.map((exercise) => ({
            id: exercise._id,
            name: exercise.name,
            type: exercise.type,
            category: exercise.category,
            description: exercise.description,
          }))}
          onSort={handleSort}
          totalCount={totalCount}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          handleEdit={handleEditExercise}
          handleDelete={handleDeleteClick}
        />
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this exercise?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExerciseList;