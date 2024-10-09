import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchNutritionById, createNutrition, updateNutrition, selectNutritionById } from '../../features/nutrition/nutritionSlice';
import { Nutrition } from '../../utils/types';

interface NutritionFormProps {
  id?: string;
  open: boolean;
  onClose: (fetch: boolean) => void;
}

const validationSchema = Yup.object({
  date: Yup.date().required('Date is required'),
  notes: Yup.string().optional(),
});

const NutritionForm: React.FC<NutritionFormProps> = ({ id, open, onClose }) => {
  const dispatch = useAppDispatch();
  const currentNutrition = useAppSelector(selectNutritionById);

  useEffect(() => {
    if (id && open) {
      dispatch(fetchNutritionById(id));
    }
  }, [dispatch, id, open]);

  const formik = useFormik<Nutrition>({
    initialValues: {
      date: (currentNutrition && currentNutrition?.date) ? new Date(currentNutrition?.date).toISOString().split('T')[0] : '',
      notes: currentNutrition?.notes || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values: any) => {
      if (id) {
        await dispatch(updateNutrition({ id, nutritionEntry: values }));
      } else {
        await dispatch(createNutrition(values));
      }
      onClose(true);
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{id ? 'Edit Nutrition' : 'Add Nutrition'}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            id="date"
            name="date"
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={formik.touched.date && formik.errors.date}
          />
          <TextField
            fullWidth
            margin="normal"
            id="notes"
            name="notes"
            label="Notes"
            multiline
            rows={4}
            value={formik.values.notes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.notes && Boolean(formik.errors.notes)}
            helperText={formik.touched.notes && formik.errors.notes}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(false)} color="secondary">Cancel</Button>
          <Button type="submit" color="primary">
            {id ? 'Update' : 'Add'} Nutrition
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NutritionForm;
