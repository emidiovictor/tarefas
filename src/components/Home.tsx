import React from 'react';
import { Typography, Card, Row, Col, Button } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined, UnorderedListOutlined, ScheduleOutlined, DatabaseOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  return (
    <div>
      <Title level={2}>Sistema de Gerenciamento de Tarefas</Title>
      <Paragraph>
        Bem-vindo ao sistema de gerenciamento de tarefas e funcionários. Este sistema permite cadastrar funcionários,
        tarefas e atribuir tarefas a múltiplos funcionários, gerando automaticamente uma escala de trabalho.
      </Paragraph>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={8}>
          <Card
            title="Funcionários"
            bordered={true}
            extra={<Link to="/funcionarios"><Button type="primary">Acessar</Button></Link>}
            style={{ height: '100%' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
              <UserOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <Paragraph>
                Cadastre e gerencie os funcionários do sistema.
              </Paragraph>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            title="Tarefas"
            bordered={true}
            extra={<Link to="/tarefas"><Button type="primary">Acessar</Button></Link>}
            style={{ height: '100%' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
              <UnorderedListOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <Paragraph>
                Cadastre e gerencie as tarefas a serem realizadas.
              </Paragraph>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            title="Atribuições"
            bordered={true}
            extra={<Link to="/atribuicoes"><Button type="primary">Acessar</Button></Link>}
            style={{ height: '100%' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
              <ScheduleOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <Paragraph>
                Atribua tarefas aos funcionários e gere relatórios.
              </Paragraph>
            </div>
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={8}>
          <Card
            title="Gerenciamento de Dados"
            bordered={true}
            extra={<Link to="/dados"><Button type="primary">Acessar</Button></Link>}
            style={{ height: '100%' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
              <DatabaseOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <Paragraph>
                Importe e exporte dados do sistema para trabalhar offline.
              </Paragraph>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
