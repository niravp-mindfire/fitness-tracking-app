// BreadcrumbsComponent.tsx
import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface BreadcrumbsComponentProps {
  items: { label: string; path?: string }[];
}

const BreadcrumbsComponent: React.FC<BreadcrumbsComponentProps> = ({ items }) => {
  const navigate = useNavigate();

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {items.map((item: any, index) => (
        item.path ? (
          <Link key={index} underline="hover" color="inherit" onClick={() => navigate(item.path)} sx={{ cursor: 'pointer' }}>
            {item.label}
          </Link>
        ) : (
          <Typography key={index} color="text.primary">
            {item.label}
          </Typography>
        )
      ))}
    </Breadcrumbs>
  );
};

export default BreadcrumbsComponent;
