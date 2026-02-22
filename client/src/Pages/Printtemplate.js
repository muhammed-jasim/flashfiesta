import React, { forwardRef } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider, Grid } from '@mui/material';
import { format } from 'date-fns';

const EinvoiceTemplate = forwardRef(({ order }, ref) => {
  if (!order) return null;

  return (
    <Paper ref={ref} sx={{ p: 6, minHeight: '1000px', backgroundColor: '#FFFFFF', boxShadow: 'none' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 8 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#12B76A', mb: 1 }}>FLASH FIESTA</Typography>
          <Typography variant="body2" color="text.secondary">123 Flash St, Swift City, 90210</Typography>
          <Typography variant="body2" color="text.secondary">contact@flashfiesta.com</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>TAX INVOICE</Typography>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>#ORD-{order.id.slice(0, 8).toUpperCase()}</Typography>
        </Box>
      </Box>

      {/* Info Grid */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={6}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase' }}>Bill To</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>{order.full_name}</Typography>
          <Typography variant="body2" color="text.secondary">{order.address}</Typography>
          <Typography variant="body2" color="text.secondary">{order.city}, {order.zip_code}</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase' }}>Order Date</Typography>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>{format(new Date(order.created_at), 'MMM dd, yyyy')}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase' }}>Status</Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, color: '#12B76A' }}>{order.status.toUpperCase()}</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Items Table */}
      <TableContainer sx={{ mb: 6 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ borderTop: '2px solid #111827', borderBottom: '2px solid #111827' }}>
              <TableCell sx={{ fontWeight: 800, py: 2 }}>Description</TableCell>
              <TableCell align="center" sx={{ fontWeight: 800 }}>Qty</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Unit Price</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.items?.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell sx={{ py: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.product_name}</Typography>
                </TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="right">${parseFloat(item.price).toFixed(2)}</TableCell>
                <TableCell align="right">${(item.quantity * item.price).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Totals */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Box sx={{ width: '300px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color="text.secondary">Subtotal</Typography>
            <Typography sx={{ fontWeight: 700 }}>${parseFloat(order.total_amount).toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color="text.secondary">Shipping</Typography>
            <Typography sx={{ fontWeight: 700, color: '#12B76A' }}>FREE</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Total</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#12B76A' }}>${parseFloat(order.total_amount).toFixed(2)}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 'auto', pt: 10, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>Thank you for shopping with Flash Fiesta!</Typography>
        <Typography variant="caption" color="text.secondary">This is a computer generated invoice and does not require a physical signature.</Typography>
      </Box>
    </Paper>
  );
});

export default EinvoiceTemplate;
