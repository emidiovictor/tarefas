import React, { useState } from 'react';
import { Card, Button, Upload, message, Typography, Space, Divider } from 'antd';
import { UploadOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { importDataFromJson, exportDataToJson } from '../services/dataService';

const { Title, Paragraph } = Typography;
const { Dragger } = Upload;

const DataManagement: React.FC = () => {
  const [fileList, setFileList] = useState<any[]>([]);

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        if (importDataFromJson(jsonData)) {
          message.success('Dados importados com sucesso!');
          // Reload the page to reflect the changes
          window.location.reload();
        } else {
          message.error('Erro ao importar dados. Verifique o formato do arquivo.');
        }
      } catch (error) {
        message.error('Erro ao ler o arquivo JSON.');
        console.error(error);
      }
    };
    reader.readAsText(file);
    
    // Don't upload the file to any server
    return false;
  };

  const handleExport = () => {
    try {
      const jsonData = exportDataToJson();
      
      // Create a blob and download it
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `tarefas_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      message.success('Dados exportados com sucesso!');
    } catch (error) {
      message.error('Erro ao exportar dados.');
      console.error(error);
    }
  };

  const resetData = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('tarefasAppData');
      message.success('Dados limpos com sucesso!');
      // Reload the page to reflect the changes
      window.location.reload();
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    accept: '.json',
    beforeUpload: handleImport,
    onChange(info: any) {
      setFileList(info.fileList.slice(-1));
    },
    onRemove() {
      setFileList([]);
    },
  };

  return (
    <div>
      <Title level={2}>Gerenciamento de Dados</Title>
      <Paragraph>
        Aqui você pode importar e exportar os dados do sistema. Isso permite que você faça backup dos seus dados
        ou transfira-os para outro dispositivo sem precisar de um servidor.
      </Paragraph>

      <Card title="Importar Dados" style={{ marginBottom: 16 }}>
        <Paragraph>
          Selecione um arquivo JSON para importar dados. Isso substituirá todos os dados atuais do sistema.
        </Paragraph>
        <Dragger {...uploadProps} style={{ padding: '20px 0' }}>
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">Clique ou arraste um arquivo para esta área para importar</p>
          <p className="ant-upload-hint">Suporte apenas para arquivos JSON exportados deste sistema</p>
        </Dragger>
      </Card>

      <Card title="Exportar Dados">
        <Paragraph>
          Exporte todos os dados do sistema para um arquivo JSON. Você pode usar este arquivo para fazer backup
          ou transferir seus dados para outro dispositivo.
        </Paragraph>
        <Button 
          type="primary" 
          icon={<DownloadOutlined />} 
          onClick={handleExport}
          style={{ marginBottom: 16 }}
        >
          Exportar Dados
        </Button>
        
        <Divider />
        
        <Title level={4} style={{ color: '#ff4d4f' }}>Zona de Perigo</Title>
        <Paragraph>
          Esta ação limpará todos os dados do sistema. Use com cautela.
        </Paragraph>
        <Button 
          danger 
          icon={<ReloadOutlined />} 
          onClick={resetData}
        >
          Limpar Todos os Dados
        </Button>
      </Card>
    </div>
  );
};

export default DataManagement;
