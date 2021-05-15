FROM mcr.microsoft.com/dotnet/sdk:5.0-alpine AS build
WORKDIR /src
COPY ["ServerApp/micro-win.csproj", "ServerApp/"]
RUN dotnet restore "ServerApp/micro-win.csproj"
COPY . .
WORKDIR "/src/ServerApp"
RUN dotnet publish "micro-win.csproj" -c Release -r alpine-x64 --self-contained true /p:PublishTrimmed=true /p:PublishSingleFile=true -o /app/publish

FROM mcr.microsoft.com/dotnet/runtime-deps:5.0-alpine AS final
WORKDIR /app
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
COPY --from=build /app/publish .

RUN mkdir /data
# Creates a non-root user with an explicit UID and adds permission to access the /app folder
# For more info, please refer to https://aka.ms/vscode-docker-dotnet-configure-containers
RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app && chown -R appuser /data
USER appuser
VOLUME [ "/data" ]

ENTRYPOINT ["./micro-win"]
