FROM mcr.microsoft.com/dotnet/aspnet:5.0-alpine AS base
WORKDIR /app
EXPOSE 5000

ENV ASPNETCORE_URLS=http://+:5000

RUN mkdir /data

# Creates a non-root user with an explicit UID and adds permission to access the /app folder
# For more info, please refer to https://aka.ms/vscode-docker-dotnet-configure-containers
RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app && chown -R appuser /data
USER appuser
VOLUME [ "/data" ]

FROM mcr.microsoft.com/dotnet/sdk:5.0-alpine AS build
RUN apk update 
ENV ALPINE_MIRROR "http://dl-cdn.alpinelinux.org/alpine"
RUN echo "${ALPINE_MIRROR}/edge/main" >> /etc/apk/repositories
RUN apk add --no-cache nodejs-current yarn --repository="http://dl-cdn.alpinelinux.org/alpine/edge/community"

WORKDIR /src
COPY ["micro-win.csproj", "./"]
RUN dotnet restore "micro-win.csproj" --runtime alpine-x64
COPY . .
WORKDIR "/src/."

FROM build AS publish
RUN dotnet publish "micro-win.csproj" -c Release -r alpine-x64 --self-contained true /p:PublishTrimmed=true /p:PublishSingleFile=true -o /app/publish

FROM mcr.microsoft.com/dotnet/runtime-deps:5.0-alpine AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["./micro-win"]
