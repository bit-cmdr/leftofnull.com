source "https://rubygems.org"

# Hello! This is where you manage which Jekyll version is used to run.
# When you want to use a different version, change it below, save the
# file and run `bundle install`. Run Jekyll with `bundle exec`, like so:
#
#     bundle exec jekyll serve
#
gem "github-pages", ">= 232", group: :jekyll_plugins
# If you have any plugins, put them here!
group :jekyll_plugins do
    gem 'jekyll-feed', '>= 0.0'
    gem 'jekyll-sitemap', '>= 0.0'
    gem 'jekyll-paginate', '>= 0.0'
    gem 'jekyll-seo-tag', '>= 0.0'
    gem 'jekyll-archives', '>= 0.0'
    gem 'kramdown', '>= 2.4'
    gem 'rouge', '>= 3.3'
end

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
    gem "tzinfo", ">= 2.0"
    gem "tzinfo-data", ">= 0.0"
  end
  
# Performance-booster for watching directories on Windows
gem "wdm", ">= 0.1.1", platforms: [:mingw, :x64_mingw, :mswin]

gem "webrick", ">= 1.7"