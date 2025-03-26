# Sistema de Gerenciamento de Tarefas

Este é um sistema desenvolvido em React com TypeScript e Vite para gerenciamento de funcionários e atribuição de tarefas.

## Funcionalidades

- Cadastro de funcionários (nome)
- Cadastro de tarefas (descrição)
- Atribuição de tarefas a múltiplos funcionários
- Visualização da escala de tarefas

## Tecnologias Utilizadas

- React
- TypeScript
- Vite
- Ant Design
- JSON Server (para simular uma API)

## Como Executar o Projeto

1. Instale as dependências:
```
npm install
```

2. Inicie o servidor JSON para simular a API:
```
npm run server
```

3. Em outro terminal, inicie a aplicação:
```
npm run dev
```

4. Acesse a aplicação no navegador:
```
http://localhost:5173
```

## Estrutura do Projeto

- `/src/components`: Componentes React
  - `/funcionarios`: Componentes relacionados a funcionários
  - `/tarefas`: Componentes relacionados a tarefas
  - `/atribuicoes`: Componentes relacionados a atribuições de tarefas
- `/src/services`: Serviços para comunicação com a API
- `/src/types`: Definições de tipos TypeScript

## Deploy no GitHub Pages

Para fazer o deploy deste projeto no GitHub Pages, siga estas etapas:

1. Crie um repositório no GitHub chamado `tarefas` (ou o nome que preferir)

2. Atualize o campo `homepage` no arquivo `package.json` com seu nome de usuário do GitHub:
   ```json
   "homepage": "https://seu-usuario.github.io/tarefas",
   ```

3. Inicialize o Git no projeto (se ainda não estiver inicializado):
   ```
   git init
   ```

4. Adicione o repositório remoto:
   ```
   git remote add origin https://github.com/seu-usuario/tarefas.git
   ```

5. Adicione todos os arquivos ao Git:
   ```
   git add .
   ```

6. Faça o commit inicial:
   ```
   git commit -m "Versão inicial do sistema de tarefas"
   ```

7. Envie o código para o GitHub:
   ```
   git push -u origin main
   ```
   (ou `master` dependendo da branch padrão do seu repositório)

8. Execute o comando de deploy:
   ```
   npm run deploy
   ```

9. Acesse seu site em: `https://seu-usuario.github.io/tarefas`
