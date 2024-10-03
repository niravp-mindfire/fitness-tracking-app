import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { TextField, Button, Box, Typography, Card, CardContent, CircularProgress, AppBar, Toolbar } from '@mui/material';
import { createFoodItem, updateFoodItem, fetchFoodItemById, resetCurrentFoodItem } from '../../features/foodItem/foodItem';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import BreadcrumbsComponent from '../../component/BreadcrumbsComponent';
import { path } from '../../utils/path';
import { FoodItemSchema } from '../../utils/validationSchema';

const FoodItemForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const existingFoodItem = useAppSelector(state => state.foodItem.currentFoodItem);
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
            }
          }
        if (id) {
          await dispatch(updateFoodItem({ id: id as string, foodItemData: payload })).unwrap();
        } else {
          await dispatch(createFoodItem(payload)).unwrap();
        }
        navigate(path.FOOD_ITEM);
      } catch (error) {
        console.error('Failed to save food item:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
        <Toolbar>
          <BreadcrumbsComponent
            items={[
              { label: 'Food Items', path: path.FOOD_ITEM },
              { label: id ? 'Edit Food Item' : 'Add Food Item' },
            ]}
          />
        </Toolbar>
      </AppBar>

      <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            {id ? 'Edit Food Item' : 'Add Food Item'}
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              {...formik.getFieldProps('name')}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name ? String(formik.errors.name) : ''}
            />
            <TextField
              fullWidth
              label="Calories"
              type="number"
              {...formik.getFieldProps('calories')}
              error={formik.touched.calories && Boolean(formik.errors.calories)}
              helperText={formik.touched.calories && formik.errors.calories ? String(formik.errors.calories) : ''}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Protein (g)"
              type="number"
              {...formik.getFieldProps('proteins')}
              error={formik.touched.proteins && Boolean(formik.errors.proteins)}
              helperText={formik.touched.proteins && formik.errors.proteins ? String(formik.errors.proteins) : ''}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Carbohydrates (g)"
              type="number"
              {...formik.getFieldProps('carbohydrates')}
              error={formik.touched.carbohydrates && Boolean(formik.errors.carbohydrates)}
              helperText={formik.touched.carbohydrates && formik.errors.carbohydrates ? String(formik.errors.carbohydrates) : ''}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Fat (g)"
              type="number"
              {...formik.getFieldProps('fats')}
              error={formik.touched.fats && Boolean(formik.errors.fats)}
              helperText={formik.touched.fats && formik.errors.fats ? String(formik.errors.fats) : ''}
              sx={{ mt: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : id ? 'Update Food Item' : 'Add Food Item'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default FoodItemForm;

