import React from 'react';
import { Layout, Menu } from 'antd';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FuncionariosList from './components/funcionarios/FuncionariosList';
import FuncionariosForm from './components/funcionarios/FuncionariosForm';
import TarefasList from './components/tarefas/TarefasList';
import TarefasForm from './components/tarefas/TarefasForm';
import AtribuicoesList from './components/atribuicoes/AtribuicoesList';
import AtribuicoesForm from './components/atribuicoes/AtribuicoesForm';
import Home from './components/Home';
import DataManagement from './components/DataManagement';
import './index.css';

const { Header, Content, Footer } = Layout;

// Usar o basename vazio para compatibilidade com a configuração base: './' do Vite
const basename = '';

const App: React.FC = () => {
  return (
    <Router basename={basename}>
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          <div className="logo" style={{ color: 'white', marginRight: '20px', fontSize: '18px', fontWeight: 'bold' }}>Sistema de Tarefas</div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            items={[
              {
                key: '1',
                label: <Link to="/">Home</Link>,
              },
              {
                key: '2',
                label: <Link to="/funcionarios">Funcionários</Link>,
              },
              {
                key: '3',
                label: <Link to="/tarefas">Tarefas</Link>,
              },
              {
                key: '4',
                label: <Link to="/atribuicoes">Atribuições</Link>,
              },
              {
                key: '5',
                label: <Link to="/dados">Gerenciar Dados</Link>,
              },
            ]}
          />
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div
            className="site-layout-content"
            style={{
              margin: '16px 0',
              padding: 24,
              background: '#fff',
              borderRadius: 8,
              minHeight: 280,
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/funcionarios" element={<FuncionariosList />} />
              <Route path="/funcionarios/novo" element={<FuncionariosForm />} />
              <Route path="/funcionarios/editar/:id" element={<FuncionariosForm />} />
              <Route path="/tarefas" element={<TarefasList />} />
              <Route path="/tarefas/novo" element={<TarefasForm />} />
              <Route path="/tarefas/editar/:id" element={<TarefasForm />} />
              <Route path="/atribuicoes" element={<AtribuicoesList />} />
              <Route path="/atribuicoes/novo" element={<AtribuicoesForm />} />
              <Route path="/atribuicoes/editar/:id" element={<AtribuicoesForm />} />
              <Route path="/dados" element={<DataManagement />} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Sistema de Gerenciamento de Tarefas {new Date().getFullYear()}
        </Footer>
      </Layout>
    </Router>
  );
};

export default App;
