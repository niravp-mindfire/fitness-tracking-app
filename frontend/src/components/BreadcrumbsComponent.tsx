// BreadcrumbsComponent.tsx
import React from 'react';
import { Breadcrumbs, Typography } from '@mui/material';
import Link from 'next/link'; // Import Link from Next.js

interface BreadcrumbsComponentProps {
  items: { label: string; path?: string }[];
}

const BreadcrumbsComponent: React.FC<BreadcrumbsComponentProps> = ({
  items,
}) => {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      {items.map((item, index) =>
        item.path ? (
          <Link key={index} href={item.path} passHref>
            <Typography color="inherit" sx={{ cursor: 'pointer' }}>
              {item.label}
            </Typography>
          </Link>
        ) : (
          <Typography key={index} color="text.primary">
            {item.label}
          </Typography>
        ),
      )}
    </Breadcrumbs>
  );
};

export default BreadcrumbsComponent;
