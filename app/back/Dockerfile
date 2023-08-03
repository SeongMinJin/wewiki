FROM node
# COPY ./srcs /home
WORKDIR /home
RUN sudo npm install -g n
RUN sudo n latest
RUN npm install -g npm@latest
CMD npm i && npm run start