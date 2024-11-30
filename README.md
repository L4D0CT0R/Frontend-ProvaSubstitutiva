# Aplicativo de Monitoramento de Sensores

Este é um aplicativo mobile desenvolvido com React Native e Expo para monitoramento em tempo real de dados de sensores. A aplicação permite exibir gráficos de temperatura e umidade, com opções para filtrar por sensor e intervalo de tempo. Além disso, a aplicação conta com funcionalidades para visualizar e limpar dados armazenados no servidor.

## Funcionalidades

- **Tela de Login**: Autenticação de usuários.
- **Tela de Registro**: Cadastro de novos usuários.
- **Tela de Gráficos**: Exibe gráficos de temperatura e umidade com dados em tempo real, com opções para filtrar os dados por sensor e intervalo de tempo.
- **Conexão em Tempo Real**: Utiliza o Socket.IO para receber atualizações dos dados de sensores em tempo real.
- **Deletação de Dados**: Permite ao usuário limpar todos os dados dos sensores do servidor.

## Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento de aplicativos móveis.
- **Expo**: Ferramenta que simplifica o desenvolvimento com React Native.
- **Chart.js**: Biblioteca para renderização de gráficos.
- **Socket.IO**: Biblioteca para comunicação em tempo real.
- **React Navigation**: Biblioteca para navegação entre telas.

## Como Rodar o Projeto

### Pré-requisitos

Certifique-se de que o [Node.js](https://nodejs.org/) e o [Expo CLI](https://docs.expo.dev/get-started/installation/) estão instalados em seu computador.

### Instalação

1. Clone este repositório:

   ```bash
    git clone https://github.com/SEU-USUARIO/seu-repositorio.git
    cd seu-repositorio

2. Instalando depêndencias:
    npm install

3. Iniciando a aplicação
    npx expo start