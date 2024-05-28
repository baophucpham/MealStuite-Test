import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ticketApi } from '../api/ticketApi';
import { userApi } from '../api/userApi';
import Tickets from './Tickets';

// Mock the APIs
jest.mock('../api/ticketApi');
jest.mock('../api/userApi');

describe('Ticket', () => {
  const mockedTicketApi = ticketApi as jest.Mocked<typeof ticketApi>;
  const mockedUserApi = userApi as jest.Mocked<typeof userApi>;

  const mockTickets = [
    {
      id: 1,
      description: 'Install a monitor arm',
      assigneeId: 1,
      completed: false,
    },
    {
      id: 2,
      description: 'Move the desk to the new location',
      assigneeId: 2,
      completed: true,
    },
  ];

  const mockUsers = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];

  beforeEach(() => {
    mockedTicketApi.getListTicket.mockResolvedValue(mockTickets);
    mockedUserApi.getListUser.mockResolvedValue(mockUsers);
  });

  test('render List tickets with data', async () => {
    render(
      <MemoryRouter>
        <Tickets />
      </MemoryRouter>
    );

    // Wait for the tickets and users data to be loaded
    await waitFor(() => {
      expect(screen.getByText('Install a monitor arm')).toBeInTheDocument();
      expect(
        screen.getByText('Move the desk to the new location')
      ).toBeInTheDocument();
    });
  });

  test('click on "Create Ticket" button opens modal', async () => {
    render(
      <MemoryRouter>
        <Tickets />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Create Ticket'));

    await waitFor(() => {
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });
  });

  test('filter tickets by status', async () => {
    render(
      <MemoryRouter>
        <Tickets />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Sort'));
    fireEvent.click(screen.getByText('Completed'));

    await waitFor(() => {
      expect(
        screen.getByText('Move the desk to the new location')
      ).toBeInTheDocument();
      expect(
        screen.queryByText('Install a monitor arm')
      ).not.toBeInTheDocument();
    });
  });

  test('assignee a ticket to a user', async () => {
    render(
      <MemoryRouter>
        <Tickets />
      </MemoryRouter>
    );
    await waitFor(() => {
      // Find the dropdown options for each ticket's status
      const dropdownOptions = screen.getAllByRole('option', {
        name: /Select Assignee/,
      });

      // Click on the dropdown option with the text "Completed"
      dropdownOptions.forEach((option) => {
        if (option.textContent === 'Bob') {
          option.click();
        }
      });
    });
  });

  test('completed a ticket', async () => {
    render(
      <MemoryRouter>
        <Tickets />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Find the dropdown options for each ticket's status
      const dropdownOptions = screen.getAllByRole('option', {
        name: /Select Status/,
      });

      // Click on the dropdown option with the text "Completed"
      dropdownOptions.forEach((option) => {
        if (option.textContent === 'Completed') {
          option.click();
        }
      });
    });
  });
});
