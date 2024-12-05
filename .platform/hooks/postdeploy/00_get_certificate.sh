#!/usr/bin/env bash
# Place in .platform/hooks/postdeploy directory
sudo certbot -n -d turtleshell.is404.net --nginx --agree-tos --email blasb@byu.edu