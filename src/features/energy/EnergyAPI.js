import api from '../../api/axios';

export const fetchAllEnergyUsage = () => api.get('/energy/usage');

export const addEnergyUsage = (data) => api.post('/energy/usage', data);

export const updateEnergyUsage = (id, data) => api.put(`/energy/usage/${id}`, data);

export const deleteEnergyUsage = (id) => api.delete(`/energy/usage/${id}`);
