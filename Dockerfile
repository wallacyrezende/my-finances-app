FROM node:16.14.0 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ARG CONFIGURATION
RUN npm run build -- --configuration=${CONFIGURATION}

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/my-finances-app /usr/share/nginx/html
ARG PORT
EXPOSE ${PORT}
CMD ["nginx", "-g", "daemon off;"]