---
layout: default
comments: false
---

{% assign sorted_posts = site.posts | sort: 'date' | reverse %}
{% for post in sorted_posts %}
  <span class="post-meta">Published {{ post.date | date: '%B %d, %Y' }}</span>
  <h2>
    <a class="post-link" href="{{ site.url }}{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a>
  </h2>
{% endfor %}