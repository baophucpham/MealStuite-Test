import { Ticket, User } from '@acme/shared-models';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ticketApi } from '../api/ticketApi';
import { userApi } from '../api/userApi';
import { Popup } from '../components';
import { STATUS_TICKET } from '../constants/data';
import styles from './tickets.module.css';

export function Tickets() {
  const navigate = useNavigate();

  const onDetailPage = (id: number | null) => {
    navigate(`/${id}`);
  };
  const [modalShow, setModalShow] = useState(false);

  const [tickets, setTickets] = useState([] as Ticket[]);
  const [users, setUsers] = useState([] as User[]);
  const [sortValue, setSortValue] = useState('');

  const getNameUserAssignee = (id: number | null) => {
    const user = users.find((x) => x.id === id);
    return user?.name || '';
  };
  async function fetchTickets() {
    const response = await ticketApi.getListTicket();
    setTickets(response);
    return response;
  }

  async function fetchUsers() {
    const data = await userApi.getListUser();
    setUsers(data);
  }

  useEffect(() => {
    fetchTickets();
    fetchUsers();
  }, []);

  const onSubmitModal = async (data: any) => {
    try {
      setModalShow(false);
      if (data) {
        const response = await ticketApi.createTicket(data.description);
        setTickets((data) => [...data, response]);
        toast.success('success', {
          position: 'top-right',
          autoClose: 1500,
        });
      }
    } catch (error) {
      toast.error('error', {
        position: 'top-right',
        autoClose: 1500,
      });
    }
  };

  const onAssignee = async (ticketId: number, userId: number) => {
    try {
      await ticketApi.assignee(ticketId, userId);
      await fetchTickets();
      toast.success('success', {
        position: 'top-right',
        autoClose: 1500,
      });
    } catch (error) {
      toast.error('error', {
        position: 'top-right',
        autoClose: 1500,
      });
    }
  };

  const onUnassginee = async (ticketId: number) => {
    try {
      await ticketApi.unassign(ticketId);
      await fetchTickets();
      toast.success('success', {
        position: 'top-right',
        autoClose: 1500,
      });
    } catch (error) {
      toast.error('error', {
        position: 'top-right',
        autoClose: 1500,
      });
    }
  };

  const onCompleteTicket = async (id: number) => {
    try {
      await ticketApi.completeTicket(id);
      await fetchTickets();
      toast.success('success', {
        position: 'top-right',
        autoClose: 1500,
      });
    } catch (error) {
      toast.error('error', {
        position: 'top-right',
        autoClose: 1500,
      });
    }
  };

  const onUnCompleteTicket = async (id: number) => {
    try {
      await ticketApi.uncompleteTicket(id);
      await fetchTickets();
      toast.success('success', {
        position: 'top-right',
        autoClose: 1500,
      });
    } catch (error) {
      toast.error('error', {
        position: 'top-right',
        autoClose: 1500,
      });
    }
  };

  const onAdd = () => setModalShow(true);

  const handleSelect = async (eventKey: any) => {
    let data: Ticket[] = [];
    const dataTicket: Ticket[] = await fetchTickets();
    setSortValue(eventKey);
    switch (eventKey) {
      case 'In Progress':
        data = dataTicket.filter((ticket) => ticket.completed === false);
        break;
      case 'Completed':
        data = dataTicket.filter((ticket) => ticket.completed === true);
        break;
      default:
        data = dataTicket;
        break;
    }
    setTickets(data);
    toast.success('success', {
      position: 'top-right',
      autoClose: 1500,
    });
  };

  return (
    <React.Fragment>
      <Container>
        <Row>
          <Col className="d-flex justify-content-center">
            <h2>Tickets</h2>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-end">
            <Dropdown onSelect={handleSelect}>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                {sortValue !== '' ? sortValue : 'Sort'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="All">All</Dropdown.Item>
                <Dropdown.Item eventKey="In Progress">
                  In Progress
                </Dropdown.Item>
                <Dropdown.Item eventKey="Completed">Completed</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button variant="success" onClick={onAdd} className="ms-2">
              Create Ticket
            </Button>
          </Col>
        </Row>

        <Row>
          {tickets.length ? (
            <table className={styles['ticket-table']}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Desciption</th>
                  <th>Assigneed</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td
                      data-label="ID"
                      onClick={() => onDetailPage(t.assigneeId)}
                    >
                      {t.id}
                    </td>
                    <td
                      data-label="Description"
                      onClick={() => onDetailPage(t.assigneeId)}
                    >
                      {t.description}
                    </td>
                    <td data-label="Assignee">
                      <Form.Group className="mb-3">
                        <Form.Select
                          name="assignee"
                          value={String(t.assigneeId)}
                          onChange={(e) => {
                            if (+e.target.value === 0) {
                              onUnassginee(t.id);
                            } else {
                              onAssignee(t.id, +e.target.value);
                            }
                          }}
                        >
                          <option value={0}>Select Assignee</option>
                          {users.map((user: any) => {
                            return (
                              <option key={user.id} value={user.id}>
                                {getNameUserAssignee(user.id)}
                              </option>
                            );
                          })}
                        </Form.Select>
                      </Form.Group>
                    </td>
                    <td data-label="Status">
                      <Form.Group className="mb-3">
                        <Form.Select
                          name="status"
                          value={
                            t.completed === true
                              ? STATUS_TICKET[1].id
                              : STATUS_TICKET[0].id
                          }
                          onChange={() => {
                            if (t.completed) {
                              onUnCompleteTicket(t.id);
                            } else {
                              onCompleteTicket(t.id);
                            }
                          }}
                        >
                          <option>Select Status</option>
                          {STATUS_TICKET.map((status: any) => {
                            return (
                              <option key={status.id} value={status.id}>
                                {status?.name}
                              </option>
                            );
                          })}
                        </Form.Select>
                      </Form.Group>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Row>
              <Col className="d-flex justify-content-center mt-20">
                <Spinner animation="border" variant="primary" />
              </Col>
            </Row>
          )}
        </Row>
      </Container>
      <Popup show={modalShow} onHide={onSubmitModal} users={users} />
    </React.Fragment>
  );
}

export default Tickets;
