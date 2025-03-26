import axios from 'axios';
import { Funcionario, Tarefa, Atribuicao } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

// Funcionários
export const getFuncionarios = async (): Promise<Funcionario[]> => {
  const response = await api.get('/funcionarios');
  return response.data;
};

export const getFuncionarioById = async (id: number): Promise<Funcionario> => {
  const response = await api.get(`/funcionarios/${id}`);
  return response.data;
};

export const createFuncionario = async (funcionario: Funcionario): Promise<Funcionario> => {
  const response = await api.post('/funcionarios', funcionario);
  return response.data;
};

export const updateFuncionario = async (funcionario: Funcionario): Promise<Funcionario> => {
  const response = await api.put(`/funcionarios/${funcionario.id}`, funcionario);
  return response.data;
};

export const deleteFuncionario = async (id: number): Promise<void> => {
  await api.delete(`/funcionarios/${id}`);
};

// Tarefas
export const getTarefas = async (): Promise<Tarefa[]> => {
  const response = await api.get('/tarefas');
  return response.data;
};

export const getTarefaById = async (id: number): Promise<Tarefa> => {
  const response = await api.get(`/tarefas/${id}`);
  return response.data;
};

export const createTarefa = async (tarefa: Tarefa): Promise<Tarefa> => {
  const response = await api.post('/tarefas', tarefa);
  return response.data;
};

export const updateTarefa = async (tarefa: Tarefa): Promise<Tarefa> => {
  const response = await api.put(`/tarefas/${tarefa.id}`, tarefa);
  return response.data;
};

export const deleteTarefa = async (id: number): Promise<void> => {
  await api.delete(`/tarefas/${id}`);
};

// Atribuições
export const getAtribuicoes = async (): Promise<Atribuicao[]> => {
  const response = await api.get('/atribuicoes');
  return response.data;
};

export const getAtribuicaoById = async (id: number): Promise<Atribuicao> => {
  const response = await api.get(`/atribuicoes/${id}`);
  return response.data;
};

export const createAtribuicao = async (atribuicao: Atribuicao): Promise<Atribuicao> => {
  const response = await api.post('/atribuicoes', atribuicao);
  return response.data;
};

export const updateAtribuicao = async (atribuicao: Atribuicao): Promise<Atribuicao> => {
  const response = await api.put(`/atribuicoes/${atribuicao.id}`, atribuicao);
  return response.data;
};

export const deleteAtribuicao = async (id: number): Promise<void> => {
  await api.delete(`/atribuicoes/${id}`);
};

export default api;
