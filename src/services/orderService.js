import api from './authService';

export const createOrder = async (orderData) => {
  const res = await api.post('/api/v1/orders', orderData);
  return res.data; // { success, message, data: order }
};

export const createRazorpayOrder = async (orderId) => {
  const res = await api.post('/api/v1/payments/create-order', { orderId });
  return res.data; // { success, data: { payment, key_id, amount, currency, rzpOrderId } }
};

export const verifyPayment = async (paymentData) => {
  // { razorpayOrderId, razorpayPaymentId, razorpaySignature }
  const res = await api.post('/api/v1/payments/verify', paymentData);
  return res.data; 
};

export const getMyOrders = async () => {
  const res = await api.get('/api/v1/orders/my-orders');
  return res.data;
};
