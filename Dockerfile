FROM node:18-alpine

WORKDIR /app

# 1. Copia APENAS os arquivos de definição de dependências
COPY package*.json ./

# 2. Copia a pasta prisma (verifique o caminho correto)
COPY ./prisma ./prisma/

# 3. Instala dependências
RUN npm install --frozen-lockfile

# 4. Gera o cliente do Prisma
RUN npx prisma generate

# 5. Copia o RESTANTE do código
COPY . .

# 6. Build da aplicação
RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]