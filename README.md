# fc-clean-architecture-ts
repositorio iniciado a partir do repositorio "entities-example-typescript"

# installs NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# download and install Node.js
nvm install 20

# pacotes de teste
npm i -D jest @types/jest ts-node --save-dev
npm i -D @swc/jest @swc/cli @swc/core

# inicializar jest
npx jest --init

# inicializar endpoints api
npm run dev

# executar testes
npm test

