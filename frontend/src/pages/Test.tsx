import React from 'react';
import Sidebar from '../pages/test/Sidebar';
import Dashboard from '../pages/test/Dashboard';
import FriendsActivity from '../pages/test/FriendsActivity';

const Test = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col p-4">
        <Dashboard />
      </div>
      <FriendsActivity />
    </div>
  );
};

export default Test;
