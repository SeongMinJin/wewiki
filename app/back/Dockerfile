FROM node
COPY ./srcs /usr/src
WORKDIR /usr/src
RUN npm install -g n
RUN n latest
RUN npm install -g npm@latest
CMD bash
# CMD npm i && npm run start