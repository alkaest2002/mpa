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
    outputs:
      - html
      - json
      - map
---
