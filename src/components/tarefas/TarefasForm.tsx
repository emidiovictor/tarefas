import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { createTarefa, getTarefaById, updateTarefa } from '../../services/dataService';
import { Tarefa } from '../../types';

const { Title } = Typography;
const { TextArea } = Input;

const TarefasForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      fetchTarefa();
    }
  }, [id]);

  const fetchTarefa = async () => {
    try {
      setLoading(true);
      const tarefa = await getTarefaById(Number(id));
      form.setFieldsValue(tarefa);
    } catch (error) {
      message.error('Erro ao carregar dados da tarefa');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: Tarefa) => {
    try {
      setLoading(true);
      if (isEditing) {
        await updateTarefa({ ...values, id: Number(id) });
        message.success('Tarefa atualizada com sucesso');
      } else {
        await createTarefa(values);
        message.success('Tarefa criada com sucesso');
      }
      navigate('/tarefas');
    } catch (error) {
      message.error('Erro ao salvar tarefa');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>{isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}</Title>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ descricao: '' }}
        >
          <Form.Item
            name="descricao"
            label="Descrição"
            rules={[{ required: true, message: 'Por favor, informe a descrição da tarefa' }]}
          >
            <TextArea 
              placeholder="Descrição da tarefa" 
              rows={4}
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button onClick={() => navigate('/tarefas')}>Cancelar</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEditing ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default TarefasForm;
