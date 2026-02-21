import React, { forwardRef } from 'react';
import { Box, Typography, Paper } from '@mui/material';

const EinvoiceTemplate = forwardRef((props, ref) => {
  return (
    <Paper ref={ref} sx={{ width: '850px', padding: '10px', height: '800px' }}>
      <Box sx={{ border: "2px solid black", borderRadius: '6px', padding: '10px' }}>
        <Typography variant="h5" sx={{ display: "flex", justifyContent: "center", fontWeight: 600 }}>
          Tax Invoice
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-around", marginTop: "10px", border: "1px solid black" }}>
          <Box sx={{ paddingRight: "10px", textAlign: 'center' }}>
            <Typography>Invoice No</Typography>
            <Typography>رقم الفاتورة</Typography>
            <Typography>977865764545</Typography>
          </Box>
          <Box sx={{ paddingRight: "10px", textAlign: 'center' }}>
            <Typography>Invoice Date</Typography>
            <Typography>رقم الفاتورة</Typography>
            <Typography>DD/MM/YYYY</Typography>
          </Box>
          <Box sx={{ paddingRight: "10px", textAlign: 'center' }}>
            <Typography>Delivery Date</Typography>
            <Typography>تاريخ توصيل</Typography>
            <Typography>11/11/2023</Typography>
          </Box>
          <Box sx={{ paddingRight: "10px", textAlign: 'center' }}>
            <Typography>Reference No</Typography>
            <Typography>رقم المرجع</Typography>
            <Typography>12345678</Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "10px", backgroundColor: '#002647', color: "white", padding: '4px' }}>
          <Typography>Seller</Typography>
          <Typography>تاجر</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', border: "1px solid black" }}>
          <Box sx={{ borderRight: '1px solid black', width: '50%', padding: '4px' }}>
            {/* Address Information */}
            {/* Your address details here */}
          </Box>
          <Box sx={{ padding: '4px' }}>
            {/* Arabic Address Details */}
            {/* Your address details here */}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
});

export default EinvoiceTemplate;
