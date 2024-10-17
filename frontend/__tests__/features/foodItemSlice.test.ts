import { configureStore } from '@reduxjs/toolkit';
import foodItemReducer, {
  fetchFoodItems,
  fetchFoodItemById,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
  resetCurrentFoodItem,
} from '../../src/features/foodItem/foodItem';
import axiosInstance from '../../src/utils/axiosInstance';
import { apiUrl } from '../../src/utils/apiUrl';

jest.mock('../../src/utils/axiosInstance'); // Mock the axiosInstance

describe('foodItemSlice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({ reducer: { foodItem: foodItemReducer } });
  });

  it('should return the initial state', () => {
    const initialState = {
      foodItems: [],
      currentFoodItem: null,
      loading: false,
      error: null,
      totalCount: 0,
    };
    expect(store.getState().foodItem).toEqual(initialState);
  });

  it('should handle fetchFoodItems pending', async () => {
    const fetchFoodItemsAction = fetchFoodItems.pending('', '');
    store.dispatch(fetchFoodItemsAction);
    const state = store.getState().foodItem;

    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should handle fetchFoodItems fulfilled', async () => {
    const mockResponse = {
      data: {
        data: {
          foodItems: [
            {
              _id: '1',
              name: 'Apple',
              calories: 95,
              macronutrients: { proteins: 0.5, carbohydrates: 25, fats: 0.3 },
            },
          ],
          total: 1,
        },
      },
    };

    (axiosInstance.get as jest.Mock).mockResolvedValue(mockResponse);

    await store.dispatch(fetchFoodItems({}));
    const state = store.getState().foodItem;

    expect(state.loading).toBe(false);
    expect(state.foodItems).toEqual(mockResponse.data.data.foodItems);
    expect(state.totalCount).toEqual(mockResponse.data.data.total);
  });

  it('should handle fetchFoodItems rejected', async () => {
    const errorMessage = 'Failed to fetch food items';
    (axiosInstance.get as jest.Mock).mockRejectedValue({
      response: { data: errorMessage },
    });

    await store.dispatch(fetchFoodItems({}));
    const state = store.getState().foodItem;

    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('should handle fetchFoodItemById fulfilled', async () => {
    const mockResponse = {
      data: {
        data: {
          _id: '1',
          name: 'Apple',
          calories: 95,
          macronutrients: { proteins: 0.5, carbohydrates: 25, fats: 0.3 },
        },
      },
    };

    (axiosInstance.get as jest.Mock).mockResolvedValue(mockResponse);

    await store.dispatch(fetchFoodItemById('1'));
    const state = store.getState().foodItem;

    expect(state.currentFoodItem).toEqual(mockResponse.data.data);
  });

  it('should handle createFoodItem fulfilled', async () => {
    const mockFoodItem = {
      _id: '1',
      name: 'Apple',
      calories: 95,
      macronutrients: { proteins: 0.5, carbohydrates: 25, fats: 0.3 },
    };
    (axiosInstance.post as jest.Mock).mockResolvedValue({ data: mockFoodItem });

    await store.dispatch(createFoodItem(mockFoodItem));
    const state = store.getState().foodItem;
  });

  it('should handle updateFoodItem fulfilled', async () => {
    const mockFoodItem = {
      _id: '1',
      name: 'Banana',
      calories: 105,
      macronutrients: { proteins: 1.3, carbohydrates: 27, fats: 0.3 },
    };
    const mockResponse = { data: mockFoodItem };
    (axiosInstance.put as jest.Mock).mockResolvedValue(mockResponse);

    // Initially add a different item
    store.dispatch(
      createFoodItem({
        _id: '1',
        name: 'Apple',
        calories: 95,
        macronutrients: { proteins: 0.5, carbohydrates: 25, fats: 0.3 },
      }),
    );

    await store.dispatch(
      updateFoodItem({ id: '1', foodItemData: mockFoodItem }),
    );
    const state = store.getState().foodItem;
  });

  it('should handle deleteFoodItem fulfilled', async () => {
    const mockFoodItem = {
      _id: '1',
      name: 'Apple',
      calories: 95,
      macronutrients: { proteins: 0.5, carbohydrates: 25, fats: 0.3 },
    };

    // First add the food item
    store.dispatch(createFoodItem(mockFoodItem));

    (axiosInstance.delete as jest.Mock).mockResolvedValue({
      data: mockFoodItem,
    });

    await store.dispatch(deleteFoodItem('1'));
    const state = store.getState().foodItem;

    expect(state.foodItems).not.toContainEqual(mockFoodItem);
  });

  it('should reset currentFoodItem', () => {
    store.dispatch(resetCurrentFoodItem());
    const state = store.getState().foodItem;

    expect(state.currentFoodItem).toBe(null);
  });
});
