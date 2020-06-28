# Dockerfile for an auditor
FROM node:12.16

COPY src /opt/app
# COPY ../orchestraProtocol.js /opt/app

ENTRYPOINT ["node", "/opt/app/auditor.js"]