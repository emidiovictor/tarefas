import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Popconfirm, message, Tag, Card } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAtribuicoes, deleteAtribuicao, getTarefas, getFuncionarios } from '../../services/dataService';
import { Atribuicao, Funcionario, Tarefa } from '../../types';

const { Title } = Typography;

const AtribuicoesList: React.FC = () => {
  const [atribuicoes, setAtribuicoes] = useState<Atribuicao[]>([]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [atribuicoesData, tarefasData, funcionariosData] = await Promise.all([
        getAtribuicoes(),
        getTarefas(),
        getFuncionarios()
      ]);
      setAtribuicoes(atribuicoesData);
      setTarefas(tarefasData);
      setFuncionarios(funcionariosData);
    } catch (error) {
      message.error('Erro ao carregar dados');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteAtribuicao(id);
      message.success('Atribuição excluída com sucesso');
      fetchData();
    } catch (error) {
      message.error('Erro ao excluir atribuição');
      console.error(error);
    }
  };

  const getTarefaDescricao = (tarefaId: number) => {
    const tarefa = tarefas.find(t => t.id === tarefaId);
    return tarefa ? tarefa.descricao : 'Tarefa não encontrada';
  };

  const getFuncionariosNomes = (funcionariosIds: number[]) => {
    return funcionariosIds.map(id => {
      const funcionario = funcionarios.find(f => f.id === id);
      return funcionario ? funcionario.nome : 'Funcionário não encontrado';
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tarefa',
      key: 'tarefa',
      render: (_: any, record: Atribuicao) => getTarefaDescricao(record.tarefaId),
    },
    {
      title: 'Funcionários',
      key: 'funcionarios',
      render: (_: any, record: Atribuicao) => (
        <div>
          {getFuncionariosNomes(record.funcionariosIds).map((nome, index) => (
            <Tag color="blue" key={index}>
              {nome}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Periodicidade',
      dataIndex: 'periodicidade',
      key: 'periodicidade',
    },
    {
      title: 'Data de Criação',
      key: 'dataCriacao',
      render: (_: any, record: Atribuicao) => new Date(record.dataCriacao).toLocaleDateString(),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Atribuicao) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => navigate(`/atribuicoes/editar/${record.id}`)}
          >
            Editar
          </Button>
          <Popconfirm
            title="Tem certeza que deseja excluir esta atribuição?"
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
        <Title level={2}>Atribuições de Tarefas</Title>
        <Link to="/atribuicoes/novo">
          <Button type="primary" icon={<PlusOutlined />}>
            Nova Atribuição
          </Button>
        </Link>
      </div>

      <Card title="Escala de Tarefas" style={{ marginBottom: 16 }}>
        <p>
          Aqui você pode visualizar todas as atribuições de tarefas aos funcionários.
          Cada atribuição mostra qual tarefa foi designada, quais funcionários são responsáveis
          e a periodicidade da tarefa.
        </p>
      </Card>

      <Table
        columns={columns}
        dataSource={atribuicoes}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default AtribuicoesList;
