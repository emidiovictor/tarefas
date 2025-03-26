# Sistema de Gerenciamento de Tarefas e Funcionários

## Descrição
Este sistema permitirá o cadastro de funcionários e tarefas, além da atribuição de tarefas a múltiplos funcionários, gerando automaticamente uma escala de trabalho.

## Funcionalidades Principais
1. **Cadastro de Funcionários**
   - Formulário simples para adicionar nome do funcionário
   - Lista de funcionários cadastrados
   - Opção para editar e remover funcionários

2. **Cadastro de Tarefas**
   - Formulário para adicionar descrição da tarefa
   - Lista de tarefas cadastradas
   - Opção para editar e remover tarefas

3. **Atribuição de Tarefas**
   - Seleção de uma tarefa específica
   - Seleção múltipla de funcionários para realizar a tarefa
   - Definição de periodicidade (semanal)
   - Geração automática de escala

4. **Visualização de Escalas**
   - Exibição das tarefas e seus respectivos funcionários responsáveis
   - Organização por data/semana

## Tecnologias
- **React** - Biblioteca para construção da interface
- **Vite** - Ferramenta de build e desenvolvimento
- **Ant Design** - Biblioteca de componentes UI
- **JSON Server** - Para armazenamento dos dados em arquivo JSON

## Estrutura de Dados
```json
{
  "funcionarios": [
    {
      "id": 1,
      "nome": "Nome do Funcionário"
    }
  ],
  "tarefas": [
    {
      "id": 1,
      "descricao": "Descrição da Tarefa"
    }
  ],
  "atribuicoes": [
    {
      "id": 1,
      "tarefaId": 1,
      "funcionariosIds": [1, 2, 3],
      "periodicidade": "semanal",
      "dataCriacao": "2025-03-25T00:00:00.000Z"
    }
  ]
}
```

## Fluxo de Uso
1. Usuário cadastra funcionários
2. Usuário cadastra tarefas
3. Usuário seleciona uma tarefa
4. Usuário seleciona os funcionários que realizarão a tarefa
5. Sistema gera a escala e armazena no JSON
6. Usuário visualiza as escalas geradas

## Interface
- Design limpo e intuitivo usando Ant Design
- Layout responsivo
- Navegação simples entre as diferentes funcionalidades
