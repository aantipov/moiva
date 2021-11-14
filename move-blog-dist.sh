#!/usr/bin/env bash

shopt -s dotglob
rm -rf dist/blog 
mkdir dist/blog
mv ./blog/.vitepress/dist/* ./dist/blog/