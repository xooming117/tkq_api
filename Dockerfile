FROM node

WORKDIR /opt/tkq/api

COPY . /opt/tkq/api

#RUN npm config set registry https://registry.npm.taobao.org

RUN npm install

# 暴露 3030 端口
EXPOSE 3030

CMD ["node", "app.js"]

