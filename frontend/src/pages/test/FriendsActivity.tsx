import React from 'react';
import { Avatar } from '@mui/material';

const friends = [
  { name: 'Max Stone', activity: 'Weekly Bicycle', time: '10 min ago' },
  { name: 'Grisha Jack', activity: 'Slow Jogging', time: '22 min ago' },
  { name: 'Levi Patrick', activity: 'Morning Swim', time: '32 min ago' },
];

const FriendsActivity = () => {
  return (
    <div className="w-1/4 bg-gray-100 p-4">
      <h2 className="text-lg font-semibold mb-4">Friends</h2>
      <div className="space-y-4">
        {friends.map((friend, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Avatar>{friend.name[0]}</Avatar>
            <div>
              <p className="font-semibold">{friend.name}</p>
              <p className="text-gray-500">{friend.activity}</p>
              <p className="text-sm text-gray-400">{friend.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsActivity;
