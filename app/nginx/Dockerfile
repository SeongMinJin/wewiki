FROM nginx
RUN apt update
RUN apt install certbot -y
RUN apt install python3-certbot-nginx -y
RUN certbot --nginx --agree-tos -d wewiki.me -d www.wewiki.me -m sorksoek2@gmail.com
COPY ./nginx.conf /etc/nginx/