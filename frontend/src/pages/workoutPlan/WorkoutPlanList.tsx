import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  fetchWorkoutPlans,
  deleteWorkoutPlan,
} from "../../features/workoutPlan/workoutPlanSlice";
import DataTable from "../../component/Datatable";
import { RootState, useAppDispatch } from "../../app/store";
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { appPath } from "../../utils/appPath";

const WorkoutPlanList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { workoutPlans, totalCount, loading } = useSelector((state: RootState) => state.workoutPlan);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    getAllData();
  }, [dispatch, page, rowsPerPage, sortBy, sortOrder, search]);

  const getAllData = () => {
    dispatch(
      fetchWorkoutPlans({
        page: page + 1,
        limit: rowsPerPage,
        search,
        sort: sortBy,
        order: sortOrder as "asc" | "desc",
      })
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

  const handleSort = (field: string, order: "asc" | "desc") => {
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
      await dispatch(deleteWorkoutPlan(deleteId));
      setDialogOpen(false);
      setDeleteId(null);
      getAllData();
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDeleteId(null);
  };

  const columns = [
    { field: "name", headerName: "Title", sorting: true },
    { field: "description", headerName: "Description", sorting: true },
    { field: "duration", headerName: "Duration (Weeks)", sorting: true },
    { field: "createdAt", headerName: "Created At", sorting: true },
  ];

  const tableData = workoutPlans?.map((plan: any) => ({
    id: plan._id,
    name: plan.title,
    description: plan.description,
    duration: plan.duration,
    createdAt: new Date(plan.createdAt).toDateString(),
  }));

  const handleEditWorkoutPlan = (id: any) => {
    navigate(`${appPath.WORKOUT_PLAN}/edit/${id}`);
  };

  return (
    <div>
      <h1>Workout Plan List</h1>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <TextField
          variant="outlined"
          label="Search"
          value={search}
          onChange={handleSearchChange}
          sx={{ width: "300px" }}
        />
        <Button variant="contained" onClick={() => navigate(`${appPath.WORKOUT_PLAN}/add`)}>
          Add Workout Plan
        </Button>
      </Box>

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

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this workout plan?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WorkoutPlanList;
