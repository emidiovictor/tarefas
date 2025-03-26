import React, { useEffect, useState } from 'react';
import { Form, Button, Card, Typography, message, Select, DatePicker, Radio, Space, Divider, Modal, Table, Switch, List, Avatar } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  createAtribuicao, 
  getAtribuicaoById, 
  updateAtribuicao, 
  getTarefas, 
  getFuncionarios 
} from '../../services/dataService';
import { Atribuicao, Funcionario, Tarefa } from '../../types';
import moment from 'moment';
import { SwapOutlined, PrinterOutlined, ArrowUpOutlined, ArrowDownOutlined, SyncOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface RelatorioItem {
  key: string;
  data: string;
  tarefa: string;
  funcionario: string;
  assinatura: string;
}

const AtribuicoesForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [relatorioVisible, setRelatorioVisible] = useState<boolean>(false);
  const [relatorioData, setRelatorioData] = useState<RelatorioItem[]>([]);
  const [funcionarioAtual, setFuncionarioAtual] = useState<number>(0);
  const [orderBy, setOrderBy] = useState<'data' | 'funcionario'>('data');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
  const [rodizioAtivado, setRodizioAtivado] = useState<boolean>(true);
  const [ordemFuncionarios, setOrdemFuncionarios] = useState<Funcionario[]>([]);
  const [ordemModalVisible, setOrdemModalVisible] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  useEffect(() => {
    fetchDados();
    if (isEditing) {
      fetchAtribuicao();
    }
  }, [id]);

  useEffect(() => {
    // Atualizar a ordem dos funcionários quando a seleção mudar
    const values = form.getFieldsValue();
    if (values.funcionariosIds && values.funcionariosIds.length > 0) {
      const funcionariosSelecionados = funcionarios.filter(f => 
        values.funcionariosIds.includes(f.id)
      );
      
      // Preservar a ordem atual se já existir, apenas adicionando ou removendo funcionários
      if (ordemFuncionarios.length > 0) {
        // Manter a ordem existente e adicionar novos funcionários ao final
        const funcionariosExistentes = ordemFuncionarios.filter(f => 
          values.funcionariosIds.includes(f.id)
        );
        
        // Encontrar novos funcionários que não estão na ordem atual
        const novosFuncionarios = funcionariosSelecionados.filter(f => 
          !funcionariosExistentes.some(fe => fe.id === f.id)
        );
        
        setOrdemFuncionarios([...funcionariosExistentes, ...novosFuncionarios]);
      } else {
        // Inicializar com a ordem padrão
        setOrdemFuncionarios(funcionariosSelecionados);
      }
    } else {
      setOrdemFuncionarios([]);
    }
  }, [form.getFieldValue('funcionariosIds'), funcionarios]);

  const fetchDados = async () => {
    try {
      setLoading(true);
      const [tarefasData, funcionariosData] = await Promise.all([
        getTarefas(),
        getFuncionarios()
      ]);
      setTarefas(tarefasData);
      setFuncionarios(funcionariosData);
    } catch (error) {
      message.error('Erro ao carregar dados');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAtribuicao = async () => {
    try {
      setLoading(true);
      const atribuicao = await getAtribuicaoById(Number(id));
      form.setFieldsValue({
        ...atribuicao,
        dataCriacao: atribuicao.dataCriacao ? moment(atribuicao.dataCriacao) : null,
        dateRange: atribuicao.dataInicio && atribuicao.dataFim ? 
          [moment(atribuicao.dataInicio), moment(atribuicao.dataFim)] : null
      });
    } catch (error) {
      message.error('Erro ao carregar dados da atribuição');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const dateRange = values.dateRange || [];
      const atribuicao: Atribuicao = {
        tarefaId: values.tarefaId,
        funcionariosIds: values.funcionariosIds,
        periodicidade: values.periodicidade,
        dataCriacao: new Date().toISOString(),
        dataInicio: dateRange[0] ? dateRange[0].toISOString() : undefined,
        dataFim: dateRange[1] ? dateRange[1].toISOString() : undefined
      };

      if (isEditing) {
        await updateAtribuicao({ ...atribuicao, id: Number(id) });
        message.success('Atribuição atualizada com sucesso');
      } else {
        await createAtribuicao(atribuicao);
        message.success('Atribuição criada com sucesso');
      }
      navigate('/atribuicoes');
    } catch (error) {
      message.error('Erro ao salvar atribuição');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const gerarRelatorio = () => {
    const values = form.getFieldsValue();
    const dateRange = values.dateRange || [];
    
    if (!dateRange[0] || !dateRange[1]) {
      message.error('Por favor, defina o período para gerar o relatório');
      return;
    }

    if (!values.tarefaId) {
      message.error('Por favor, selecione uma tarefa');
      return;
    }

    if (!values.funcionariosIds || values.funcionariosIds.length === 0) {
      message.error('Por favor, selecione pelo menos um funcionário');
      return;
    }

    const tarefa = tarefas.find(t => t.id === values.tarefaId);
    
    // Usar a ordem personalizada dos funcionários se disponível
    const funcionariosSelecionados = ordemFuncionarios.length > 0 
      ? ordemFuncionarios 
      : funcionarios.filter(f => values.funcionariosIds.includes(f.id));
    
    // Gerar datas baseadas na periodicidade
    const dataInicio = moment(dateRange[0]);
    const dataFim = moment(dateRange[1]);
    const periodicidade = values.periodicidade;
    
    const datas = gerarDatasNoIntervalo(dataInicio, dataFim, periodicidade);
    
    // Gerar itens do relatório
    const items: RelatorioItem[] = [];
    
    datas.forEach((data, index) => {
      // Se o rodízio estiver ativado, alterna os funcionários a cada ocorrência
      if (rodizioAtivado && funcionariosSelecionados.length > 1) {
        const funcionarioIndex = index % funcionariosSelecionados.length;
        const funcionario = funcionariosSelecionados[funcionarioIndex];
        
        items.push({
          key: `${index}-${funcionario.id}`,
          data: data.format('DD/MM/YYYY'),
          tarefa: tarefa?.descricao || 'Tarefa não encontrada',
          funcionario: funcionario.nome,
          assinatura: '___________________________'
        });
      } else {
        // Sem rodízio, todos os funcionários são atribuídos a cada data
        funcionariosSelecionados.forEach(funcionario => {
          items.push({
            key: `${index}-${funcionario.id}`,
            data: data.format('DD/MM/YYYY'),
            tarefa: tarefa?.descricao || 'Tarefa não encontrada',
            funcionario: funcionario.nome,
            assinatura: '___________________________'
          });
        });
      }
    });

    setRelatorioData(ordenarDados(items));
    setFuncionarioAtual(0);
    setRelatorioVisible(true);
  };

  const gerarDatasNoIntervalo = (inicio: moment.Moment, fim: moment.Moment, periodicidade: string) => {
    const datas: moment.Moment[] = [];
    let dataAtual = inicio.clone();
    
    while (dataAtual.isSameOrBefore(fim)) {
      datas.push(dataAtual.clone());
      
      // Avançar para a próxima data baseada na periodicidade
      switch (periodicidade) {
        case 'diária':
          dataAtual.add(1, 'day');
          break;
        case 'semanal':
          dataAtual.add(1, 'week');
          break;
        case 'quinzenal':
          dataAtual.add(2, 'week');
          break;
        case 'mensal':
          dataAtual.add(1, 'month');
          break;
        default:
          dataAtual.add(1, 'day');
      }
    }
    
    return datas;
  };

  const ordenarDados = (dados: RelatorioItem[]) => {
    return [...dados].sort((a, b) => {
      if (orderBy === 'data') {
        const dateA = moment(a.data, 'DD/MM/YYYY');
        const dateB = moment(b.data, 'DD/MM/YYYY');
        return orderDirection === 'asc' 
          ? dateA.diff(dateB) 
          : dateB.diff(dateA);
      } else {
        // Ordenar por funcionário
        return orderDirection === 'asc'
          ? a.funcionario.localeCompare(b.funcionario)
          : b.funcionario.localeCompare(a.funcionario);
      }
    });
  };

  const alternarFuncionario = () => {
    const values = form.getFieldsValue();
    if (!values.funcionariosIds || values.funcionariosIds.length <= 1) {
      return;
    }
    
    setFuncionarioAtual((prev) => (prev + 1) % values.funcionariosIds.length);
  };

  const alternarOrdenacao = (campo: 'data' | 'funcionario') => {
    if (orderBy === campo) {
      setOrderDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(campo);
      setOrderDirection('asc');
    }
    
    setRelatorioData(ordenarDados(relatorioData));
  };

  const imprimirRelatorio = () => {
    const conteudo = document.getElementById('relatorio-para-impressao');
    if (!conteudo) return;
    
    const janelaImpressao = window.open('', '_blank');
    if (!janelaImpressao) {
      message.error('Não foi possível abrir a janela de impressão. Verifique se os pop-ups estão permitidos.');
      return;
    }
    
    janelaImpressao.document.write(`
      <html>
        <head>
          <title>Relatório de Atribuição de Tarefas</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; margin-bottom: 20px; }
            h2 { text-align: center; margin-bottom: 20px; font-size: 24px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .info { margin-bottom: 20px; }
            .info p { margin: 5px 0; }
            .tarefa-header { 
              font-size: 22px; 
              font-weight: bold; 
              text-align: center; 
              margin: 15px 0; 
              padding: 10px; 
              background-color: #f8f8f8; 
              border-radius: 5px;
            }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          ${conteudo.innerHTML}
          <div style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()">Imprimir</button>
          </div>
        </body>
      </html>
    `);
    
    janelaImpressao.document.close();
  };

  const getRelatorioFiltrado = () => {
    if (!rodizioAtivado) {
      const values = form.getFieldsValue();
      if (!values.funcionariosIds || values.funcionariosIds.length === 0) {
        return relatorioData;
      }
      
      // Filtrar pelo funcionário atual se houver mais de um e o rodízio estiver desativado
      if (values.funcionariosIds.length > 1) {
        const funcionarioId = values.funcionariosIds[funcionarioAtual];
        const funcionarioNome = funcionarios.find(f => f.id === funcionarioId)?.nome || '';
        
        return relatorioData.filter(item => item.funcionario === funcionarioNome);
      }
    }
    
    return relatorioData;
  };

  const toggleRodizio = () => {
    setRodizioAtivado(!rodizioAtivado);
    // Regerar o relatório com a nova configuração
    gerarRelatorio();
  };

  const abrirModalOrdem = () => {
    const values = form.getFieldsValue();
    if (!values.funcionariosIds || values.funcionariosIds.length <= 1) {
      message.info('Selecione pelo menos dois funcionários para definir a ordem');
      return;
    }
    
    setOrdemModalVisible(true);
  };

  const onDragEnd = (result: DropResult) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    // If dropped in the same position, do nothing
    if (sourceIndex === destinationIndex) {
      return;
    }

    const newOrdemFuncionarios = [...ordemFuncionarios];
    const [removed] = newOrdemFuncionarios.splice(sourceIndex, 1);
    newOrdemFuncionarios.splice(destinationIndex, 0, removed);

    setOrdemFuncionarios(newOrdemFuncionarios);
  };

  const aplicarOrdem = () => {
    setOrdemModalVisible(false);
    message.success('Ordem dos funcionários definida com sucesso');
    
    // Regerar o relatório com a nova ordem, se estiver visível
    if (relatorioVisible) {
      gerarRelatorio();
    }
  };

  const columns = [
    {
      title: (
        <div onClick={() => alternarOrdenacao('data')} style={{ cursor: 'pointer' }}>
          Data {orderBy === 'data' && (orderDirection === 'asc' ? <ArrowUpOutlined /> : <ArrowDownOutlined />)}
        </div>
      ),
      dataIndex: 'data',
      key: 'data',
      width: '20%',
    },
    {
      title: (
        <div onClick={() => alternarOrdenacao('funcionario')} style={{ cursor: 'pointer' }}>
          Funcionário {orderBy === 'funcionario' && (orderDirection === 'asc' ? <ArrowUpOutlined /> : <ArrowDownOutlined />)}
        </div>
      ),
      dataIndex: 'funcionario',
      key: 'funcionario',
      width: '30%',
    },
    {
      title: 'Assinatura',
      dataIndex: 'assinatura',
      key: 'assinatura',
      width: '50%',
      render: () => (
        <div style={{ borderBottom: '1px solid #000', height: '30px' }}></div>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>{isEditing ? 'Editar Atribuição' : 'Nova Atribuição'}</Title>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ 
            tarefaId: undefined, 
            funcionariosIds: [], 
            periodicidade: 'semanal',
            dateRange: [moment(), moment().endOf('year')]
          }}
        >
          <Form.Item
            name="tarefaId"
            label="Tarefa"
            rules={[{ required: true, message: 'Por favor, selecione uma tarefa' }]}
          >
            <Select placeholder="Selecione uma tarefa" loading={loading}>
              {tarefas.map(tarefa => (
                <Option key={tarefa.id} value={tarefa.id}>
                  {tarefa.descricao}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="funcionariosIds"
            label={
              <Space>
                Funcionários
                <Button 
                  type="link" 
                  icon={<MenuOutlined />} 
                  onClick={abrirModalOrdem}
                  disabled={form.getFieldValue('funcionariosIds')?.length <= 1}
                  title="Definir ordem dos funcionários"
                >
                  Definir ordem
                </Button>
              </Space>
            }
            rules={[{ required: true, message: 'Por favor, selecione pelo menos um funcionário' }]}
          >
            <Select 
              mode="multiple" 
              placeholder="Selecione os funcionários" 
              loading={loading}
              optionFilterProp="children"
            >
              {funcionarios.map(funcionario => (
                <Option key={funcionario.id} value={funcionario.id}>
                  {funcionario.nome}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="periodicidade"
            label="Periodicidade"
            rules={[{ required: true, message: 'Por favor, selecione a periodicidade' }]}
          >
            <Radio.Group>
              <Radio.Button value="diária">Diária</Radio.Button>
              <Radio.Button value="semanal">Semanal</Radio.Button>
              <Radio.Button value="quinzenal">Quinzenal</Radio.Button>
              <Radio.Button value="mensal">Mensal</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Período (Data de Início e Fim)"
            rules={[{ required: true, message: 'Por favor, defina o período da atribuição' }]}
          >
            <RangePicker 
              style={{ width: '100%' }} 
              format="DD/MM/YYYY"
              placeholder={['Data de início', 'Data de término']}
            />
          </Form.Item>

          <Divider />

          <Form.Item>
            <Space style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button onClick={() => navigate('/atribuicoes')}>Cancelar</Button>
              <Button type="primary" onClick={gerarRelatorio}>
                Gerar Relatório
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEditing ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* Modal para definir a ordem dos funcionários */}
      <Modal
        title="Definir Ordem dos Funcionários"
        open={ordemModalVisible}
        onCancel={() => setOrdemModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setOrdemModalVisible(false)}>
            Cancelar
          </Button>,
          <Button key="apply" type="primary" onClick={aplicarOrdem}>
            Aplicar Ordem
          </Button>,
        ]}
      >
        <p>Arraste e solte os funcionários para definir a ordem do rodízio:</p>
        
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable-funcionarios">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ 
                  padding: '8px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px',
                  minHeight: '200px'
                }}
              >
                {ordemFuncionarios.map((funcionario, index) => (
                  <Draggable 
                    key={funcionario.id ? funcionario.id.toString() : `index-${index}`} 
                    draggableId={funcionario.id ? funcionario.id.toString() : `index-${index}`} 
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          padding: '12px',
                          margin: '0 0 8px 0',
                          backgroundColor: snapshot.isDragging ? '#e6f7ff' : 'white',
                          border: '1px solid #d9d9d9',
                          borderRadius: '4px',
                          boxShadow: snapshot.isDragging ? '0 0 5px rgba(0,0,0,0.2)' : 'none',
                          ...provided.draggableProps.style
                        }}
                      >
                        <Space>
                          <Avatar icon={<UserOutlined />} />
                          <span style={{ fontWeight: 'bold' }}>{index + 1}.</span>
                          <span>{funcionario.nome}</span>
                        </Space>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        
        <div style={{ marginTop: '16px' }}>
          <p>A ordem definida será usada para o rodízio de funcionários nas tarefas.</p>
          <p>O primeiro funcionário da lista começará o rodízio, seguido pelos demais na ordem estabelecida.</p>
        </div>
      </Modal>

      {/* Modal do relatório */}
      <Modal
        title="Relatório de Atribuição de Tarefas"
        open={relatorioVisible}
        onCancel={() => setRelatorioVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setRelatorioVisible(false)}>
            Fechar
          </Button>,
          <Button 
            key="ordem" 
            icon={<MenuOutlined />} 
            onClick={abrirModalOrdem}
            disabled={form.getFieldValue('funcionariosIds')?.length <= 1}
          >
            Definir Ordem
          </Button>,
          <Button 
            key="alternar" 
            icon={<SwapOutlined />} 
            onClick={alternarFuncionario}
            disabled={rodizioAtivado || form.getFieldValue('funcionariosIds')?.length <= 1}
          >
            Alternar Funcionário
          </Button>,
          <Button 
            key="imprimir" 
            type="primary" 
            icon={<PrinterOutlined />} 
            onClick={imprimirRelatorio}
          >
            Imprimir
          </Button>,
        ]}
      >
        <div style={{ marginBottom: '16px' }}>
          <Space>
            <Switch 
              checkedChildren="Rodízio Ativado" 
              unCheckedChildren="Rodízio Desativado"
              checked={rodizioAtivado}
              onChange={toggleRodizio}
            />
            {rodizioAtivado && (
              <span>
                <SyncOutlined spin /> Os funcionários se alternam automaticamente nas tarefas
              </span>
            )}
          </Space>
        </div>
        
        <div id="relatorio-para-impressao">
          <div className="info">
            <h1>Relatório de Atribuição de Tarefas</h1>
            
            <div className="tarefa-header">
              {tarefas.find(t => t.id === form.getFieldValue('tarefaId'))?.descricao}
            </div>
            
            {!rodizioAtivado && (
              <p>
                <strong>Funcionário:</strong> {
                  form.getFieldValue('funcionariosIds')?.length > 1 
                    ? `${funcionarios.find(f => f.id === form.getFieldValue('funcionariosIds')[funcionarioAtual])?.nome} (${funcionarioAtual + 1}/${form.getFieldValue('funcionariosIds').length})`
                    : funcionarios.find(f => f.id === form.getFieldValue('funcionariosIds')?.[0])?.nome
                }
              </p>
            )}
            {rodizioAtivado && (
              <p>
                <strong>Funcionários em rodízio:</strong> {
                  ordemFuncionarios.length > 0
                    ? ordemFuncionarios.map(f => f.nome).join(' → ')
                    : funcionarios
                        .filter(f => form.getFieldValue('funcionariosIds')?.includes(f.id))
                        .map(f => f.nome)
                        .join(', ')
                }
              </p>
            )}
            <p><strong>Periodicidade:</strong> {form.getFieldValue('periodicidade')}</p>
            <p><strong>Período:</strong> {
              form.getFieldValue('dateRange')?.[0]?.format('DD/MM/YYYY')
            } a {
              form.getFieldValue('dateRange')?.[1]?.format('DD/MM/YYYY')
            }</p>
            {rodizioAtivado && (
              <p><strong>Modo de atribuição:</strong> Rodízio automático de funcionários</p>
            )}
          </div>
          
          <Table 
            columns={columns} 
            dataSource={getRelatorioFiltrado()} 
            pagination={false}
            bordered
            showHeader={true}
          />
        </div>
      </Modal>
    </div>
  );
};

export default AtribuicoesForm;
