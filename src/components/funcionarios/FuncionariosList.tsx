import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Popconfirm, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getFuncionarios, deleteFuncionario } from '../../services/dataService';
import { Funcionario } from '../../types';

const { Title } = Typography;

const FuncionariosList: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchFuncionarios = async () => {
    try {
      setLoading(true);
      const data = await getFuncionarios();
      setFuncionarios(data);
    } catch (error) {
      message.error('Erro ao carregar funcionários');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteFuncionario(id);
      message.success('Funcionário excluído com sucesso');
      fetchFuncionarios();
    } catch (error) {
      message.error('Erro ao excluir funcionário');
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
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Funcionario) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => navigate(`/funcionarios/editar/${record.id}`)}
          >
            Editar
          </Button>
          <Popconfirm
            title="Tem certeza que deseja excluir este funcionário?"
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
        <Title level={2}>Funcionários</Title>
        <Link to="/funcionarios/novo">
          <Button type="primary" icon={<PlusOutlined />}>
            Novo Funcionário
          </Button>
        </Link>
      </div>
      <Table
        columns={columns}
        dataSource={funcionarios}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default FuncionariosList;
