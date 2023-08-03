FROM node
# COPY ./srcs /home
WORKDIR /home
RUN npm install -g n
RUN n latest
RUN npm install -g npm@latest
CMD npm i && npm run start