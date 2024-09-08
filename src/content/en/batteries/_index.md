---
title: Catalogo generale
id: batteries

build:
  list: always
  publishResources: true
  render: link
  
cascade:
 
  - _target:
      path: /batteries/**
    build:
      list: always
      publishResources: true
      render: always

  - _target:
      path: /batteries/**
      kind: page
    outputs:
      - html
      - json
---
Seleziona la batteria da somministrare.