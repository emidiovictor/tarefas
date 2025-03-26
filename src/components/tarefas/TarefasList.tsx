import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Popconfirm, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getTarefas, deleteTarefa } from '../../services/dataService';
import { Tarefa } from '../../types';

const { Title } = Typography;

const TarefasList: React.FC = () => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchTarefas = async () => {
    try {
      setLoading(true);
      const data = await getTarefas();
      setTarefas(data);
    } catch (error) {
      message.error('Erro ao carregar tarefas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTarefas();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteTarefa(id);
      message.success('Tarefa excluída com sucesso');
      fetchTarefas();
    } catch (error) {
      message.error('Erro ao excluir tarefa');
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      key: 'descricao',
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Tarefa) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => navigate(`/tarefas/editar/${record.id}`)}
          >
            Editar
          </Button>
          <Popconfirm
            title="Tem certeza que deseja excluir esta tarefa?"
            onConfirm={() => handleDelete(record.id!)}
            okText="Sim"
            cancelText="Não"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Excluir
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>Tarefas</Title>
        <Link to="/tarefas/novo">
          <Button type="primary" icon={<PlusOutlined />}>
            Nova Tarefa
          </Button>
        </Link>
      </div>
      <Table
        columns={columns}
        dataSource={tarefas}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default TarefasList;
