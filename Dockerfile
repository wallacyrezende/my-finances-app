FROM node:16.14.0 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ARG CONFIGURATION
RUN npm run build -- --configuration=${CONFIGURATION}

FROM nginx:alpine
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
ARG PORT
EXPOSE ${PORT}
CMD ["nginx", "-g", "daemon off;"]