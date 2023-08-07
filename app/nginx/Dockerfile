FROM debian
RUN apt-get update && apt-get upgrade -y && apt-get install -y nginx certbot python3-certbot-nginx
COPY ./nginx.conf /etc/nginx/
RUN nginx
RUN certbot --nginx -d wewiki.me -d www.wewiki.me
CMD nginx -g "daemon off;"