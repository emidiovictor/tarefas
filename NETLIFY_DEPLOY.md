# Deploy no Netlify

Este guia explica como fazer o deploy do Sistema de Gerenciamento de Tarefas no Netlify, uma plataforma gratuita para hospedagem de sites estáticos.

## Método 1: Deploy via Netlify Drop (Mais Simples)

1. Acesse [Netlify Drop](https://app.netlify.com/drop)
2. Arraste a pasta `dist` do seu projeto para a área indicada no site
3. Aguarde o upload e o deploy automático
4. Seu site estará disponível em um domínio temporário do Netlify (exemplo: https://random-name-123456.netlify.app)
5. Você pode personalizar o domínio nas configurações do site no Netlify

## Método 2: Deploy via GitHub

1. Certifique-se de que seu repositório está no GitHub
2. Acesse [Netlify](https://app.netlify.com/) e faça login (você pode usar sua conta GitHub)
3. Clique em "New site from Git"
4. Selecione "GitHub" como provedor de Git
5. Selecione o repositório `tarefas`
6. Configure as opções de build:
   - Branch: `master` (ou `main`)
   - Build command: `npm run build`
   - Publish directory: `dist`
7. Clique em "Deploy site"

## Configurações Adicionais

O arquivo `netlify.toml` já está configurado para:
- Usar a pasta `dist` como diretório de publicação
- Configurar redirecionamentos para que o React Router funcione corretamente

## Atualizações Futuras

Para atualizar seu site após fazer alterações:

1. Se você usou o Netlify Drop:
   - Faça as alterações no código
   - Execute `npm run build` para gerar uma nova versão da pasta `dist`
   - Arraste a pasta `dist` atualizada para o Netlify Drop novamente

2. Se você usou o GitHub:
   - Faça as alterações no código
   - Faça commit e push para o GitHub
   - O Netlify detectará as alterações e fará o deploy automaticamente
