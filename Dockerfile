FROM node:16.13.0 as packages

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY packages/utils/package.json packages/utils/package.json
COPY packages/api/package.json packages/api/package.json
COPY packages/gallery/package.json packages/gallery/package.json
COPY packages/panel/package.json packages/panel/package.json
COPY packages/site/package.json packages/site/package.json
COPY packages/server/package.json packages/server/package.json

RUN yarn install

FROM packages

WORKDIR /app

COPY tsconfig.json .env ./ 
# RUN npx browserslist@latest --update-db

WORKDIR /app/packages/utils/
ADD packages/utils .
RUN yarn build

WORKDIR /app/packages/api
ADD packages/api .
# RUN yarn install
RUN yarn build

WORKDIR /app/packages/site
ADD packages/site .
# RUN yarn install
RUN yarn build

WORKDIR /app/packages/gallery
ADD packages/gallery .
# RUN npm install
# RUN npm rebuild node-sass
# RUN yarn upgrade caniuse-lite browserlist
# RUN npx browserslist@latest --update-db
RUN yarn build

WORKDIR /app/packages/panel
ADD packages/panel .
# RUN yarn install
RUN yarn build

WORKDIR /app/packages/server
ADD packages/server .
# RUN yarn install
RUN yarn build

# COPY . .
# COPY --from=packages /app/node_modules .

# COPY --from=packages /app/utils/node_modules .
# WORKDIR /app/utils
# # RUN yarn install
# RUN yarn build

# COPY --from=packages /app/api/node_modules ./
# WORKDIR /app/api
# RUN yarn install
# RUN yarn build

# COPY --from=packages /app/gallery/node_modules ./
# WORKDIR /app/gallery
# RUN yarn install
# RUN yarn build

# COPY --from=packages /app/panel/node_modules ./
# WORKDIR /app/panel
# RUN yarn install
# RUN yarn build

# COPY --from=packages /app/site/node_modules ./
# WORKDIR /app/site
# RUN yarn install
# RUN yarn build

# COPY --from=packages /app/server/node_modules ./
# WORKDIR /app/server

# RUN yarn build

# # COPY package.json .
# # COPY yarn.lock .

# COPY . .
# RUN yarn install
# RUN yarn build

WORKDIR /app

CMD ["yarn", "run", "start"]