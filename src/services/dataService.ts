import { Funcionario, Tarefa, Atribuicao } from '../types';
import * as localStorageService from './localStorageService';

// Export all functions from the local storage service
export const {
  getFuncionarios,
  getFuncionarioById,
  createFuncionario,
  updateFuncionario,
  deleteFuncionario,
  
  getTarefas,
  getTarefaById,
  createTarefa,
  updateTarefa,
  deleteTarefa,
  
  getAtribuicoes,
  getAtribuicaoById,
  createAtribuicao,
  updateAtribuicao,
  deleteAtribuicao,
  
  importDataFromJson,
  exportDataToJson,
  initializeWithSampleData
} = localStorageService;

// Initialize the app with sample data if needed
initializeWithSampleData();
