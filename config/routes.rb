# frozen_string_literal: true

RedmineApp::Application.routes.draw do
  resources :projects do
    get '/wiki_treenav/pages/:id', to: 'wiki_treenav#pages', format: false
  end
end
