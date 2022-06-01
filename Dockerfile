FROM node:14.18 AS builder

RUN mkdir /app
ADD . /app/
WORKDIR /app
RUN  sed -i 's@localhost:8888@go-ldap-admin-server:8888@g' .env.production && npm install --registry=http://registry.npmmirror.com && yarn build:prod

FROM openresty/openresty:1.21.4.1-0-centos7
RUN mkdir /app
WORKDIR /app
COPY --from=builder /app/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist .
CMD ["nginx"]