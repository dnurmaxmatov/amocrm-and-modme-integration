FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /var/wwww
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install && mv node_modules ../
COPY . .
EXPOSE 5567
USER node
CMD ["node", "src/app.js"]
