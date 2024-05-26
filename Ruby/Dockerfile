# syntax = docker/dockerfile:1

# Use a versão específica do Ruby
ARG RUBY_VERSION=3.3.1
FROM ruby:$RUBY_VERSION-slim as base

# Diretório de trabalho da aplicação Rails
WORKDIR /rails

# Variáveis de ambiente
ENV RAILS_ENV="production" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development"

# Etapa de construção para reduzir o tamanho da imagem final
FROM base as build

# Instalar pacotes necessários para compilar gems
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential git libvips pkg-config

# Copiar e instalar gems
COPY Gemfile Gemfile.lock ./
RUN bundle install && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
    bundle exec bootsnap precompile --gemfile

# Copiar código da aplicação
COPY . .

# Precompilar código do bootsnap para tempos de inicialização mais rápidos
RUN bundle exec bootsnap precompile app/ lib/

# Ajustar arquivos binários para serem executáveis no Linux
RUN chmod +x bin/* && \
    sed -i "s/\r$//g" bin/* && \
    sed -i 's/ruby\.exe$/ruby/' bin/*

# Etapa final para a imagem da aplicação
FROM base

# Instalar pacotes necessários para a execução
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y curl libsqlite3-0 libvips && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copiar artefatos construídos: gems, aplicação
COPY --from=build /usr/local/bundle /usr/local/bundle
COPY --from=build /rails /rails

# Executar e possuir apenas os arquivos de runtime como um usuário não-root para segurança
RUN useradd rails --create-home --shell /bin/bash && \
    chown -R rails:rails /rails /usr/local/bundle

# Definir usuário rails
USER rails:rails 

# Ponto de entrada para preparar o banco de dados
ENTRYPOINT ["/rails/bin/docker-entrypoint"]

# Expor a porta 3000
EXPOSE 3000

# Comando padrão para iniciar o servidor
CMD ["./bin/rails", "server"]