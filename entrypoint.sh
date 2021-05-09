#!/bin/bash

# change ownership to user=nobody, group=nobody
sudo chown -R appuser:appuser /data

# open with su a new shell as user nobody and call your applic
su -s /bin/bash -c "dotnet /app/publish/micro-win.dll" appuser

