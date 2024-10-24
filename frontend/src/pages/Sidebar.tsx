// src/components/Sidebar.tsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Settings,
  ExitToApp,
  FitnessCenter,
  Fitbit,
  AllInclusive,
  NextPlan,
  FoodBank,
  EmojiEvents,
  Menu,
  ChevronLeft,
  MenuBook,
} from '@mui/icons-material';
import { path } from '../utils/path';

const Sidebar: React.FC<any> = ({
  handleLogout,
  isCollapsed,
  toggleSidebar,
}) => {
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <Home />, path: path.DASHBOARD },
    { text: 'Workout', icon: <Fitbit />, path: path.WORKOUT },
    { text: 'Exercise', icon: <FitnessCenter />, path: path.EXERCISE },
    {
      text: 'Workout Exercise',
      icon: <AllInclusive />,
      path: path.WORKOUT_EXERCISE,
    },
    { text: 'Workout Plan', icon: <NextPlan />, path: path.WORKOUT_PLAN },
    { text: 'Challenges', icon: <EmojiEvents />, path: path.CHALLENGE },
    { text: 'Food Items', icon: <FoodBank />, path: path.FOOD_ITEM },
    { text: 'Meal Plans', icon: <MenuBook />, path: path.MEAL_PLAN },
    { text: 'Nutritions', icon: <MenuBook />, path: path.NUTRITION },
    { text: 'Nutrition Meals', icon: <MenuBook />, path: path.NUTRITION_MEAL },
    {
      text: 'Progress Tracking',
      icon: <MenuBook />,
      path: path.PROGRESS_TRACKINGS,
    },
    { text: 'My Profile', icon: <Settings />, path: path.MY_PROFILE },
    { text: 'Logout', icon: <ExitToApp />, action: handleLogout },
  ];
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-[#EBF2FA] border-r border-gray-300 transition-all duration-300 ease-in-out shadow-lg ${
        isCollapsed ? 'w-[60px]' : 'w-[240px]'
      } z-50`}
    >
      <div className="flex items-center justify-between p-4 bg-[#064789] text-white">
        {!isCollapsed && <span className="text-lg font-bold">Admin Panel</span>}
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none"
        >
          {isCollapsed ? <Menu /> : <ChevronLeft />}
        </button>
      </div>
      <nav className="mt-2">
        {menuItems.map((item) => (
          <div key={item.text} className="relative">
            <Link
              to={item.path!}
              onClick={item.action}
              className={`flex items-center p-2 transition-colors duration-200 rounded-lg text-gray-700 hover:bg-[#427AA1] hover:text-white ${
                location.pathname === item.path ? 'bg-[#064789] text-white' : ''
              }`}
            >
              <span
                className="flex items-center justify-center"
                style={{ minWidth: '40px' }}
              >
                {item.icon}
              </span>
              {!isCollapsed && <span className="ml-2">{item.text}</span>}
            </Link>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
