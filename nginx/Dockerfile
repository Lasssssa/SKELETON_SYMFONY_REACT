FROM nginx:alpine

# Copy appropriate configuration based on build argument
ARG ENV=prod
COPY nginx.${ENV}.conf /etc/nginx/conf.d/default.conf

# Remove default nginx config
RUN rm -f /etc/nginx/conf.d/default.conf.default

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
