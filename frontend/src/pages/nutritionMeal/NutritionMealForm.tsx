import React, { useEffect, useState } from 'react';
import { FormikErrors, useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  IconButton,
  Grid,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/store';
import {
  createNutritionMeal,
  updateNutritionMeal,
  selectNutritionMealError,
  fetchNutritionMealById,
} from '../../features/nutritionMeal/nutritionMealSlice'; // Adjust the import based on your file structure
import { fetchFoodItems } from '../../features/foodItem/foodItem';
import { defaultPagination } from '../../utils/common';
import { fetchNutritionEntries } from '../../features/nutrition/nutritionSlice';

interface NutritionMealDialogProps {
  open: boolean;
  onClose: (fetch: boolean) => void;
  id?: string; // nutrition meal ID for editing
}

interface FoodItem {
  foodId: string;
  quantity: number;
}

interface NutritionMealFormValues {
  nutritionId: string;
  mealType: string;
  foodItems: FoodItem[];
}

const NutritionMealDialog: React.FC<NutritionMealDialogProps> = ({
  open,
  onClose,
  id = '',
}) => {
  const dispatch = useAppDispatch();
  const foodItems = useAppSelector((state) => state.foodItem.foodItems);
  const nutritionItems = useAppSelector(
    (state) => state.nutrition.nutritionEntries,
  );
  const currentNutritionMeal: any = useAppSelector(
    (state) => state.nutritionMeal.currentNutritionMeal,
  );

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const error = useAppSelector(selectNutritionMealError);

  const [initialValues, setInitialValues] = useState<NutritionMealFormValues>({
    nutritionId: '',
    mealType: '',
    foodItems: [{ foodId: '', quantity: 0 }],
  });

  useEffect(() => {
    if (open) {
      getAllFoodItems();
      if (id) {
        dispatch(fetchNutritionMealById(id));
      } else {
        setInitialValues({
          nutritionId: '',
          mealType: '',
          foodItems: [{ foodId: '', quantity: 0 }],
        });
      }
    }
  }, [open, id]);

  useEffect(() => {
    if (currentNutritionMeal && id) {
      setInitialValues({
        nutritionId: currentNutritionMeal.nutritionId,
        mealType: currentNutritionMeal.mealType,
        foodItems: currentNutritionMeal.foodItems.map((item: any) => ({
          foodId: item.foodId._id, // Extract the foodId from the foodId object
          quantity: item.quantity,
        })),
      });
    }
  }, [currentNutritionMeal, id]);

  const getAllFoodItems = async () => {
    await dispatch(fetchFoodItems(defaultPagination));
    await dispatch(fetchNutritionEntries(defaultPagination));
  };

  const validationSchema = Yup.object({
    nutritionId: Yup.string().required('Nutrition is required'),
    mealType: Yup.string().required('Meal type is required'),
    foodItems: Yup.array()
      .of(
        Yup.object({
          foodId: Yup.string().required('Food ID is required'),
          quantity: Yup.number()
            .required('Quantity is required')
            .positive('Quantity must be a positive number'),
        }),
      )
      .min(1, 'At least one food item must be added'),
  });

  const formik = useFormik<NutritionMealFormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values: any) => {
      try {
        if (id) {
          await dispatch(
            updateNutritionMeal({ id, nutritionMeal: values }),
          ).unwrap();
        } else {
          await dispatch(createNutritionMeal(values)).unwrap();
        }
        onClose(true);
        formik.resetForm();
      } catch (error) {
        setSnackbarOpen(true);
      }
    },
    enableReinitialize: true, // Enable reinitialization
  });

  const handleAddFoodItem = () => {
    formik.setFieldValue('foodItems', [
      ...formik.values.foodItems,
      { foodId: '', quantity: 0 },
    ]);
  };

  const handleRemoveFoodItem = (index: number) => {
    const updatedFoodItems = formik.values.foodItems.filter(
      (_, i: number) => i !== index,
    );
    formik.setFieldValue('foodItems', updatedFoodItems);
  };

  const handleFoodItemChange = (
    index: number,
    field: keyof FoodItem,
    value: string | number,
  ) => {
    const updatedFoodItems = [...formik.values.foodItems];
    updatedFoodItems[index] = { ...updatedFoodItems[index], [field]: value };

    formik.setFieldValue('foodItems', updatedFoodItems);
  };

  useEffect(() => {
    if (error) {
      setSnackbarOpen(true);
    }
  }, [error]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose(false);
        formik.resetForm();
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {id ? 'Edit Nutrition Meal' : 'Add Nutrition Meal'}
        <IconButton
          onClick={() => {
            onClose(false);
            formik.resetForm();
          }}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <TextField
            label="Food Item"
            select
            InputLabelProps={{ shrink: true }}
            SelectProps={{ native: true }}
            name={`nutritionId`}
            value={formik.values.nutritionId}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            fullWidth
            sx={{ mt: 2 }}
          >
            <option value="" disabled>
              Select Nutrition
            </option>
            {nutritionItems?.map((food: any) => (
              <option key={food?._id} value={food?._id}>
                {food?.notes} {new Date(food?.date).toLocaleDateString()}
              </option>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Meal Type"
            name="mealType"
            value={formik.values.mealType}
            disabled={formik.isSubmitting}
            onChange={formik.handleChange}
            error={formik.touched.mealType && Boolean(formik.errors.mealType)}
            helperText={
              formik.touched.mealType ? (formik.errors.mealType as string) : ''
            }
            margin="normal"
          />

          <Typography variant="h6" sx={{ mt: 2 }}>
            Food Items
          </Typography>

          {formik.values.foodItems.map((item, index) => (
            <Grid
              container
              spacing={2}
              alignItems="center"
              key={index}
              sx={{ mt: 1 }}
            >
              <Grid item xs={6}>
                <TextField
                  label="Food Item"
                  select
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{ native: true }}
                  name={`foodItems[${index}].foodId`}
                  disabled={formik.isSubmitting}
                  value={formik.values.foodItems[index].foodId}
                  onChange={formik.handleChange}
                  fullWidth
                  sx={{ mt: 2 }}
                  error={
                    !!(
                      formik.touched.foodItems?.[index]?.foodId &&
                      formik.errors.foodItems?.[index] &&
                      typeof formik.errors.foodItems?.[index] !== 'string' &&
                      (
                        formik.errors.foodItems?.[index] as FormikErrors<{
                          foodId: string;
                        }>
                      ).foodId
                    )
                  }
                  helperText={
                    formik.touched.foodItems?.[index]?.foodId &&
                    formik.errors.foodItems?.[index] &&
                    typeof formik.errors.foodItems?.[index] !== 'string' &&
                    (
                      formik.errors.foodItems?.[index] as FormikErrors<{
                        foodId: string;
                      }>
                    ).foodId
                  }
                >
                  <option value="" disabled>
                    Select Food Item
                  </option>
                  {foodItems?.map((food: any) => (
                    <option key={food?._id} value={food?._id}>
                      {food?.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Quantity"
                  type="number"
                  name={`foodItems[${index}].quantity`}
                  value={formik.values.foodItems[index].quantity}
                  disabled={formik.isSubmitting}
                  onChange={(e) =>
                    handleFoodItemChange(index, 'quantity', e.target.value)
                  }
                  error={
                    !!(
                      formik.touched.foodItems?.[index]?.quantity &&
                      formik.errors.foodItems?.[index] &&
                      typeof formik.errors.foodItems?.[index] !== 'string' &&
                      (
                        formik.errors.foodItems?.[index] as FormikErrors<{
                          quantity: number;
                        }>
                      ).quantity
                    )
                  }
                  helperText={
                    formik.touched.foodItems?.[index]?.quantity &&
                    formik.errors.foodItems?.[index] &&
                    typeof formik.errors.foodItems?.[index] !== 'string' &&
                    (
                      formik.errors.foodItems?.[index] as FormikErrors<{
                        quantity: number;
                      }>
                    ).quantity
                  }
                  fullWidth
                  sx={{ mt: 2 }}
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveFoodItem(index)}
                  sx={{ mt: 2 }}
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          ))}
          <Button variant="outlined" onClick={handleAddFoodItem} sx={{ mt: 2 }}>
            Add Food Item
          </Button>
          <DialogActions>
            <Button onClick={() => onClose(false)}>Cancel</Button>
            <Button type="submit" color="primary">
              {id ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error || 'An error occurred. Please try again.'}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default NutritionMealDialog;
