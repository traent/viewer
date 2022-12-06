FROM --platform=${BUILDPLATFORM:-linux} node:16 as node-builder

WORKDIR /frontend

COPY frontend/projects ./projects
COPY frontend/package.json frontend/package-lock.json ./
COPY frontend/angular.json ./
RUN npm ci

RUN npm run build -- --project=viewer-app --configuration=production

#
# Runtime env
#
FROM nginx
ARG NGINX_TEMPLATE=default.conf.template
COPY nginx/${NGINX_TEMPLATE} /etc/nginx/templates/
COPY --from=node-builder /frontend/dist /usr/share/nginx/app