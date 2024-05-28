import { useEffect, useState } from 'react';
import { Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { ticketApi } from '../api/ticketApi';
import { userApi } from '../api/userApi';

function Detail() {
  const { id }: any = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getDetailUser = async () => {
    try {
      const user = await userApi.getDetailUser(id);
      const tickets = await ticketApi.getListTicket();
      const getDetailTicket = tickets.find(
        (ticket) => ticket.assigneeId === user.id
      );
      const result = {
        ...getDetailTicket,
        assigneeName: user.name,
      };
      setData(result);
      setLoading(false);
    } catch (error) {
      setData(null);
    }
  };

  useEffect(() => {
    getDetailUser();
  }, [id]);

  if (loading) {
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center vh-100"
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header>
              <h2>Ticket Detail</h2>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <strong>ID:</strong> {data?.id}
              </Card.Text>
              <Card.Text>
                <strong>Description:</strong> {data?.description}
              </Card.Text>
              <Card.Text>
                <strong>Assignee:</strong> {data?.assigneeName}
              </Card.Text>
              <Card.Text>
                <strong>Status:</strong>{' '}
                {data?.completed ? 'Completed' : 'In Progress'}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Detail;
