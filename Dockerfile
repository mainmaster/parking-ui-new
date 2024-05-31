FROM node:20 as build
WORKDIR /usr/src/docker-react-sample
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm config get proxy
RUN npm config rm proxy
RUN npm config rm https-proxy
RUN yarn install

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV THEME="default"

RUN echo "DEBUG": $REACT_APP_API_URL
#To bundle your app’s source code inside the Docker image, use the COPY instruction:
COPY . .

#Your app binds to port 3000 so you’ll use the EXPOSE instruction to have it mapped by the docker daemon:
EXPOSE 3000
RUN npm run build

CMD ["npm", "start"]
