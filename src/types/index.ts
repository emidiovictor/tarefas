export interface Funcionario {
  id?: number;
  nome: string;
}

export interface Tarefa {
  id?: number;
  descricao: string;
}

export interface Atribuicao {
  id?: number;
  tarefaId: number;
  funcionariosIds: number[];
  periodicidade: string;
  dataCriacao: string;
  dataInicio?: string;
  dataFim?: string;
}

export interface TarefaComFuncionarios extends Tarefa {
  funcionarios: Funcionario[];
}
