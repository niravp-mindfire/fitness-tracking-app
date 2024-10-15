import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  createFoodItem,
  updateFoodItem,
  fetchFoodItemById,
  resetCurrentFoodItem,
} from '../../features/foodItem/foodItem';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { FoodItemSchema } from '../../utils/validationSchema';
import { DialogProps } from '../../utils/types';

const FoodItemForm: React.FC<DialogProps> = ({
  open = false,
  onClose = () => {},
  id = '',
}) => {
  const dispatch = useAppDispatch();
  const existingFoodItem = useAppSelector(
    (state) => state.foodItem.currentFoodItem,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id && !existingFoodItem) {
      dispatch(fetchFoodItemById(id));
    }
  }, [id, existingFoodItem, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetCurrentFoodItem());
    };
  }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: existingFoodItem?.name || '',
      calories: existingFoodItem?.calories || 0,
      proteins: existingFoodItem?.macronutrients?.proteins || 0,
      carbohydrates: existingFoodItem?.macronutrients?.carbohydrates || 0,
      fats: existingFoodItem?.macronutrients?.fats || 0,
    },
    validationSchema: FoodItemSchema,
    onSubmit: async (values: any) => {
      setLoading(true);
      try {
        const payload: any = {
          name: values?.name,
          calories: values?.calories,
          macronutrients: {
            proteins: values?.proteins,
            carbohydrates: values?.carbohydrates,
            fats: values?.fats,
          },
        };
        if (id) {
          await dispatch(
            updateFoodItem({ id: id as string, foodItemData: payload }),
          ).unwrap();
        } else {
          await dispatch(createFoodItem(payload)).unwrap();
        }
        onClose(true);
      } catch (error) {
        console.error('Failed to save food item:', error);
      } finally {
        setLoading(false);
      }
    },
  });

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
        {id ? 'Edit Food Item' : 'Add Food Item'}
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
            fullWidth
            label="Name"
            disabled={formik.isSubmitting}
            {...formik.getFieldProps('name')}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={
              formik.touched.name && formik.errors.name
                ? String(formik.errors.name)
                : ''
            }
          />
          <TextField
            fullWidth
            label="Calories"
            type="number"
            disabled={formik.isSubmitting}
            {...formik.getFieldProps('calories')}
            error={formik.touched.calories && Boolean(formik.errors.calories)}
            helperText={
              formik.touched.calories && formik.errors.calories
                ? String(formik.errors.calories)
                : ''
            }
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Protein (g)"
            type="number"
            disabled={formik.isSubmitting}
            {...formik.getFieldProps('proteins')}
            error={formik.touched.proteins && Boolean(formik.errors.proteins)}
            helperText={
              formik.touched.proteins && formik.errors.proteins
                ? String(formik.errors.proteins)
                : ''
            }
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Carbohydrates (g)"
            type="number"
            disabled={formik.isSubmitting}
            {...formik.getFieldProps('carbohydrates')}
            error={
              formik.touched.carbohydrates &&
              Boolean(formik.errors.carbohydrates)
            }
            helperText={
              formik.touched.carbohydrates && formik.errors.carbohydrates
                ? String(formik.errors.carbohydrates)
                : ''
            }
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Fat (g)"
            type="number"
            disabled={formik.isSubmitting}
            {...formik.getFieldProps('fats')}
            error={formik.touched.fats && Boolean(formik.errors.fats)}
            helperText={
              formik.touched.fats && formik.errors.fats
                ? String(formik.errors.fats)
                : ''
            }
            sx={{ mt: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : id ? (
              'Update Food Item'
            ) : (
              'Add Food Item'
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default FoodItemForm;
