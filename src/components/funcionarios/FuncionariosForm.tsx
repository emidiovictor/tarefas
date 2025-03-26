import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { createFuncionario, getFuncionarioById, updateFuncionario } from '../../services/dataService';
import { Funcionario } from '../../types';

const { Title } = Typography;

const FuncionariosForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      fetchFuncionario();
    }
  }, [id]);

  const fetchFuncionario = async () => {
    try {
      setLoading(true);
      const funcionario = await getFuncionarioById(Number(id));
      form.setFieldsValue(funcionario);
    } catch (error) {
      message.error('Erro ao carregar dados do funcionário');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: Funcionario) => {
    try {
      setLoading(true);
      if (isEditing) {
        await updateFuncionario({ ...values, id: Number(id) });
        message.success('Funcionário atualizado com sucesso');
      } else {
        await createFuncionario(values);
        message.success('Funcionário criado com sucesso');
      }
      navigate('/funcionarios');
    } catch (error) {
      message.error('Erro ao salvar funcionário');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>{isEditing ? 'Editar Funcionário' : 'Novo Funcionário'}</Title>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ nome: '' }}
        >
          <Form.Item
            name="nome"
            label="Nome"
            rules={[{ required: true, message: 'Por favor, informe o nome do funcionário' }]}
          >
            <Input placeholder="Nome do funcionário" />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button onClick={() => navigate('/funcionarios')}>Cancelar</Button>
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

export default FuncionariosForm;
