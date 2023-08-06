FROM nginx

RUN apt-get update && apt-get upgrade -y && apt-get install -y nginx openssl vim procps
RUN mkdir /etc/nginx/certificate && cd /etc/nginx/certificate && openssl req -new -newkey rsa:4096 -x509 -sha256 -days 365 -nodes -out nginx-certificate.crt -keyout nginx.key -subj "/C=KO/ST=Seoul/L=Seoul/O=Gaepo/CN=seojin.42.fr"

COPY ./nginx.conf /etc/nginx/