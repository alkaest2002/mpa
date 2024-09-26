---
title: Questionari
id: questionnaires

build:
  list: always
  publishResources: true
  render: link
  
cascade:
 
  - _target:
      path: /questionnaires/**
    build:
      list: always
      publishResources: true
      render: always

  - _target:
      kind: section
    layout: section
    outputs:
      - html
      - json
      - map

  - _target:
      kind: page
    layout: item
---
