FROM node:18
WORKDIR /home/node/app
COPY package.json /home/node/app
COPY tsconfig.json /home/node/app
COPY src /home/node/app
RUN npm install
RUN npm run build
EXPOSE 8080
CMD npm run start