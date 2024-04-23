FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /var/www
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install && mv node_modules ../
USER 0
RUN mkdir -p /var/www/src/private && chmod 777 /var/www/src/private
COPY . .
EXPOSE 5567
USER node
CMD ["node", "src/app.js"]
