# frozen_string_literal: true

module RedmineWikiTreenav
  class ViewListener < Redmine::Hook::ViewListener
    render_on :view_layouts_base_html_head, partial: 'wiki_treenav/html_head'
    render_on :view_layouts_base_body_bottom, partial: 'wiki_treenav/body_bottom'
  end
end
