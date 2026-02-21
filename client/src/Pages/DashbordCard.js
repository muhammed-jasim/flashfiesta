import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import axios from '../axiosInstance';
import { ProductDeatailsApi } from '../Api';
import { Typography } from '@mui/material';

const DashbordCard = (props) => {
  const [Products, setProducts] = useState([]);
  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(ProductDeatailsApi);
      setProducts(response.data.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };
  useEffect(() => {
    fetchProductDetails();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: 128,
          height: 128,
        },
      }}
    >
      {Products.map((i, index) => (
        <>
          <Paper
            key={index}
          />
          <Typography>{i.ProductName}</Typography>
          <Typography>{i.ProductID}</Typography>
        </>
      ))}

    </Box>
  )
}

export default DashbordCard
