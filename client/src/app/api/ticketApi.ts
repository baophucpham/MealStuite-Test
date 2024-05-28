import { Ticket } from '@acme/shared-models';
import axiosClient from './axiosClient';

export const ticketApi = {
  getListTicket: (): Promise<Ticket[]> => {
    const url = '/tickets';
    return axiosClient.get(url);
  },

  createTicket: (data: string): Promise<any> => {
    const url = 'tickets';
    return axiosClient.post(url, {
      description: data,
    });
  },

  getDetailTicket: (id: number): Promise<Ticket> => {
    const url = `/ticket/${id}`;
    return axiosClient.get(url);
  },

  assignee: (ticketId: number, userId: number): Promise<any> => {
    const url = `tickets/${ticketId}/assign/${userId}`;
    return axiosClient.put(url);
  },

  unassign: (ticketId: number): Promise<any> => {
    const url = `tickets/${ticketId}/unassign`;
    return axiosClient.put(url);
  },

  completeTicket: (id: number) => {
    const url = `/tickets/${id}/complete`;
    return axiosClient.put(url);
  },

  uncompleteTicket: (id: number) => {
    const url = `/tickets/${id}/complete`;
    return axiosClient.delete(url);
  },
};
