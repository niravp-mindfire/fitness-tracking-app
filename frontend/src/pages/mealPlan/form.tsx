import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Box,
  Typography,
  CardContent,
  Card,
  AppBar,
  Toolbar,
  MenuItem,
  IconButton,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchMealPlanById,
  createMealPlan,
  updateMealPlan,
  resetCurrentMealPlan,
  selectMealPlanError,
} from "../../features/mealPlan/mealPlanSlice";
import { path } from "../../utils/path";
import BreadcrumbsComponent from "../../component/BreadcrumbsComponent";
import { fetchFoodItems } from "../../features/foodItem/foodItem";
import { defaultPagination } from "../../utils/common";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

interface FoodItemEntry {
  foodId: string;
  quantity: number;
}

interface Meal {
  mealType: string;
  foodItems: FoodItemEntry[];
}

interface FormValues {
  title: string;
  description: string;
  duration: number;
  meals: Meal[];
}

const MealPlanForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const currentMealPlan = useAppSelector(
    (state) => state.mealPlan.currentMealPlan
  );

  const foodItems = useAppSelector((state) => state.foodItem.foodItems);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const error: any = useAppSelector(selectMealPlanError);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (id) {
          await dispatch(fetchMealPlanById(id));
        } else {
          dispatch(resetCurrentMealPlan(null));
        }
        await dispatch(fetchFoodItems(defaultPagination));
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setErrorMessage("Failed to fetch meal plan data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, dispatch]);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    duration: Yup.number().positive().required("Duration is required"),
    meals: Yup.array()
      .of(
        Yup.object({
          mealType: Yup.string().required("Meal type is required"),
          foodItems: Yup.array()
            .of(
              Yup.object({
                foodId: Yup.string().required("Food Item is required"),
                quantity: Yup.number()
                  .required("Quantity is required")
                  .min(1, "Quantity must be at least 1"),
              })
            )
            .min(1, "At least one food item must be added"),
        })
      )
      .min(1, "At least one meal must be added"),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      title: currentMealPlan?.title || "",
      description: currentMealPlan?.description || "",
      duration: currentMealPlan?.duration || 0,
      meals: currentMealPlan?.meals
        ? currentMealPlan.meals.map((meal: any) => ({
            mealType: meal.mealType || "",
            foodItems: meal.foodItems.map((item: any) => ({
              foodId: item.foodId || "",
              quantity: item.quantity || 0,
            })),
          }))
        : [{ mealType: "", foodItems: [{ foodId: "", quantity: 0 }] }],
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values: any) => {
      try {
        if (id) {
          await dispatch(updateMealPlan({ id, mealPlan: values })).unwrap();
        } else {
          await dispatch(createMealPlan(values)).unwrap();
        }
        navigate(path.MEAL_PLAN);
      } catch (error) {
        setSnackbarOpen(true);
      }
    },
  });

  const handleAddMeal = () => {
    formik.setFieldValue("meals", [
      ...formik.values.meals,
      { mealType: "", foodItems: [{ foodId: "", quantity: 0 }] },
    ]);
  };

  const handleAddFoodItem = (mealIndex: number) => {
    const updatedMeals = [...formik.values.meals];
    updatedMeals[mealIndex].foodItems.push({ foodId: "", quantity: 0 });
    formik.setFieldValue("meals", updatedMeals);
  };

  const handleRemoveMeal = (mealIndex: number) => {
    const updatedMeals = formik.values.meals.filter((_, i) => i !== mealIndex);
    formik.setFieldValue("meals", updatedMeals);
  };

  const handleRemoveFoodItem = (mealIndex: number, foodItemIndex: number) => {
    const updatedMeals = [...formik.values.meals];
    updatedMeals[mealIndex].foodItems = updatedMeals[
      mealIndex
    ].foodItems.filter((_, i) => i !== foodItemIndex);
    formik.setFieldValue("meals", updatedMeals);
  };

  const handleMealChange = (
    mealIndex: number,
    field: keyof Meal,
    value: string
  ) => {
    const updatedMeals = [...formik.values.meals];
    updatedMeals[mealIndex] = { ...updatedMeals[mealIndex], [field]: value };
    formik.setFieldValue("meals", updatedMeals);
  };

  const handleFoodItemChange = (
    mealIndex: number,
    foodItemIndex: number,
    field: keyof FoodItemEntry,
    value: string | number
  ) => {
    const updatedMeals = [...formik.values.meals];
    updatedMeals[mealIndex].foodItems[foodItemIndex] = {
      ...updatedMeals[mealIndex].foodItems[foodItemIndex],
      [field]: value,
    };
    formik.setFieldValue("meals", updatedMeals);
  };

  useEffect(() => {
    if (error) {
      setSnackbarOpen(true);
    }
  }, [error, dispatch]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <AppBar
        position="static"
        sx={{ backgroundColor: "transparent", boxShadow: "none" }}
      >
        <Toolbar>
          <BreadcrumbsComponent
            items={[
              { label: "Meal Plans", path: path.MEAL_PLAN },
              { label: id ? "Edit Meal Plan" : "Add Meal Plan" },
            ]}
          />
        </Toolbar>
      </AppBar>

      <Card sx={{ maxWidth: 800, mx: "auto", mt: 4, p: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            {id ? "Edit Meal Plan" : "Add Meal Plan"}
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Duration"
              name="duration"
              value={formik.values.duration}
              onChange={formik.handleChange}
              error={formik.touched.duration && Boolean(formik.errors.duration)}
              helperText={formik.touched.duration && formik.errors.duration}
              margin="normal"
            />
            <Typography variant="h6" sx={{ mt: 3 }}>
              Meals
            </Typography>

            {formik.values.meals.map((meal, mealIndex) => (
              <div key={mealIndex}>
                <TextField
                  fullWidth
                  label="Meal Type"
                  value={meal.mealType}
                  onChange={(e) =>
                    handleMealChange(mealIndex, "mealType", e.target.value)
                  }
                  margin="normal"
                />
                {meal.foodItems.map((foodItem, foodItemIndex) => (
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    key={foodItemIndex}
                    sx={{ mt: 1 }}
                  >
                    <Grid item xs={6}>
                      <TextField
                        select
                        label="Food Item"
                        value={foodItem.foodId}
                        onChange={(e) =>
                          handleFoodItemChange(
                            mealIndex,
                            foodItemIndex,
                            "foodId",
                            e.target.value
                          )
                        }
                        fullWidth
                      >
                        {foodItems.map((item) => (
                          <MenuItem key={item._id} value={item._id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={4}>
                      <TextField
                        label="Quantity"
                        type="number"
                        value={foodItem.quantity}
                        onChange={(e) =>
                          handleFoodItemChange(
                            mealIndex,
                            foodItemIndex,
                            "quantity",
                            parseInt(e.target.value)
                          )
                        }
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={2}>
                      <IconButton
                        onClick={() =>
                          handleRemoveFoodItem(mealIndex, foodItemIndex)
                        }
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}

                <Button
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => handleAddFoodItem(mealIndex)}
                  variant="outlined"
                  sx={{ mt: 2 }}
                >
                  Add Food Item
                </Button>
                <Button
                  onClick={() => handleRemoveMeal(mealIndex)}
                  color="error"
                  variant="outlined"
                  sx={{ mt: 2, ml: 2 }}
                >
                  Remove Meal
                </Button>
              </div>
            ))}

            <Button
              onClick={handleAddMeal}
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
              sx={{ mt: 3 }}
            >
              Add Meal
            </Button>

            <Box sx={{ mt: 3 }}>
              <Button type="submit" variant="contained" color="primary">
                {id ? "Update" : "Create"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="error">
          {errorMessage || "Something went wrong. Please try again."}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MealPlanForm;
