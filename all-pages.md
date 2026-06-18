---
layout: page
title: Tüm Sayfalar
permalink: /all-pages/
---

# Tüm Sayfalar

Bu sayfa, depoya yeni bir `.md` dosyası ekledikçe otomatik olarak güncellenir.

Aşağıdaki liste, `title` meta verisi olan ve yayınlanan tüm sayfaları gösterir.

<ul class="page-list">
{% assign pages_list = site.pages | sort: 'title' %}
{% for p in pages_list %}
  {% if p.title and p.url != '/404.html' and p.url != '/all-pages/' %}
    <li><a href="{{ p.url | relative_url }}">{{ p.title }}</a> <small>{{ p.url | relative_url }}</small></li>
  {% endif %}
{% endfor %}
</ul>
