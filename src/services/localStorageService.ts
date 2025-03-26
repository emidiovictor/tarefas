import { Funcionario, Tarefa, Atribuicao } from '../types';

// Default data to initialize the application
const defaultData = {
  funcionarios: [],
  tarefas: [],
  atribuicoes: []
};

// Helper function to load data from localStorage
const loadData = () => {
  try {
    const data = localStorage.getItem('tarefasAppData');
    return data ? JSON.parse(data) : defaultData;
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return defaultData;
  }
};

// Helper function to save data to localStorage
const saveData = (data: any) => {
  try {
    localStorage.setItem('tarefasAppData', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

// Helper function to generate a unique ID
const generateId = (items: any[]) => {
  const ids = items.map(item => item.id || 0);
  return ids.length > 0 ? Math.max(...ids) + 1 : 1;
};

// Funcionários
export const getFuncionarios = async (): Promise<Funcionario[]> => {
  const data = loadData();
  return data.funcionarios;
};

export const getFuncionarioById = async (id: number): Promise<Funcionario> => {
  const data = loadData();
  const funcionario = data.funcionarios.find((f: Funcionario) => f.id === id);
  if (!funcionario) {
    throw new Error(`Funcionário com ID ${id} não encontrado`);
  }
  return funcionario;
};

export const createFuncionario = async (funcionario: Funcionario): Promise<Funcionario> => {
  const data = loadData();
  const newFuncionario = {
    ...funcionario,
    id: generateId(data.funcionarios)
  };
  data.funcionarios.push(newFuncionario);
  saveData(data);
  return newFuncionario;
};

export const updateFuncionario = async (funcionario: Funcionario): Promise<Funcionario> => {
  const data = loadData();
  const index = data.funcionarios.findIndex((f: Funcionario) => f.id === funcionario.id);
  if (index === -1) {
    throw new Error(`Funcionário com ID ${funcionario.id} não encontrado`);
  }
  data.funcionarios[index] = funcionario;
  saveData(data);
  return funcionario;
};

export const deleteFuncionario = async (id: number): Promise<void> => {
  const data = loadData();
  const index = data.funcionarios.findIndex((f: Funcionario) => f.id === id);
  if (index === -1) {
    throw new Error(`Funcionário com ID ${id} não encontrado`);
  }
  data.funcionarios.splice(index, 1);
  saveData(data);
};

// Tarefas
export const getTarefas = async (): Promise<Tarefa[]> => {
  const data = loadData();
  return data.tarefas;
};

export const getTarefaById = async (id: number): Promise<Tarefa> => {
  const data = loadData();
  const tarefa = data.tarefas.find((t: Tarefa) => t.id === id);
  if (!tarefa) {
    throw new Error(`Tarefa com ID ${id} não encontrada`);
  }
  return tarefa;
};

export const createTarefa = async (tarefa: Tarefa): Promise<Tarefa> => {
  const data = loadData();
  const newTarefa = {
    ...tarefa,
    id: generateId(data.tarefas)
  };
  data.tarefas.push(newTarefa);
  saveData(data);
  return newTarefa;
};

export const updateTarefa = async (tarefa: Tarefa): Promise<Tarefa> => {
  const data = loadData();
  const index = data.tarefas.findIndex((t: Tarefa) => t.id === tarefa.id);
  if (index === -1) {
    throw new Error(`Tarefa com ID ${tarefa.id} não encontrada`);
  }
  data.tarefas[index] = tarefa;
  saveData(data);
  return tarefa;
};

export const deleteTarefa = async (id: number): Promise<void> => {
  const data = loadData();
  const index = data.tarefas.findIndex((t: Tarefa) => t.id === id);
  if (index === -1) {
    throw new Error(`Tarefa com ID ${id} não encontrada`);
  }
  data.tarefas.splice(index, 1);
  saveData(data);
};

// Atribuições
export const getAtribuicoes = async (): Promise<Atribuicao[]> => {
  const data = loadData();
  return data.atribuicoes;
};

export const getAtribuicaoById = async (id: number): Promise<Atribuicao> => {
  const data = loadData();
  const atribuicao = data.atribuicoes.find((a: Atribuicao) => a.id === id);
  if (!atribuicao) {
    throw new Error(`Atribuição com ID ${id} não encontrada`);
  }
  return atribuicao;
};

export const createAtribuicao = async (atribuicao: Atribuicao): Promise<Atribuicao> => {
  const data = loadData();
  const newAtribuicao = {
    ...atribuicao,
    id: generateId(data.atribuicoes)
  };
  data.atribuicoes.push(newAtribuicao);
  saveData(data);
  return newAtribuicao;
};

export const updateAtribuicao = async (atribuicao: Atribuicao): Promise<Atribuicao> => {
  const data = loadData();
  const index = data.atribuicoes.findIndex((a: Atribuicao) => a.id === atribuicao.id);
  if (index === -1) {
    throw new Error(`Atribuição com ID ${atribuicao.id} não encontrada`);
  }
  data.atribuicoes[index] = atribuicao;
  saveData(data);
  return atribuicao;
};

export const deleteAtribuicao = async (id: number): Promise<void> => {
  const data = loadData();
  const index = data.atribuicoes.findIndex((a: Atribuicao) => a.id === id);
  if (index === -1) {
    throw new Error(`Atribuição com ID ${id} não encontrada`);
  }
  data.atribuicoes.splice(index, 1);
  saveData(data);
};

// Function to import data from a JSON file
export const importDataFromJson = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    
    // Validate data structure
    if (!data.funcionarios || !data.tarefas || !data.atribuicoes) {
      throw new Error('Formato de dados inválido');
    }
    
    // Save to localStorage
    saveData(data);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

// Function to export data to a JSON file
export const exportDataToJson = (): string => {
  const data = loadData();
  return JSON.stringify(data, null, 2);
};

// Function to initialize the app with sample data if needed
export const initializeWithSampleData = () => {
  const data = loadData();
  
  // Only initialize if there's no data
  if (data.funcionarios.length === 0 && data.tarefas.length === 0 && data.atribuicoes.length === 0) {
    const sampleData = {
      funcionarios: [
        { id: 1, nome: 'João Silva' },
        { id: 2, nome: 'Maria Oliveira' },
        { id: 3, nome: 'Pedro Santos' }
      ],
      tarefas: [
        { id: 1, descricao: 'Limpeza do escritório' },
        { id: 2, descricao: 'Organização de documentos' },
        { id: 3, descricao: 'Atendimento ao cliente' }
      ],
      atribuicoes: [
        {
          id: 1,
          tarefaId: 1,
          funcionariosIds: [1, 2, 3],
          periodicidade: 'semanal',
          dataCriacao: new Date().toISOString(),
          dataInicio: new Date().toISOString(),
          dataFim: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
        }
      ]
    };
    
    saveData(sampleData);
  }
};
