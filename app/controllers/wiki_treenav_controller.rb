# frozen_string_literal: true

class WikiTreenavController < ApplicationController
  before_action :find_project_by_project_id
  before_action { authorize(:wiki, :show) }

  def pages
    @parent_id = params[:id]
    @pages = WikiPage.where(parent_id: @parent_id).order(Arel.sql('LOWER(title)').asc).all

    render(partial: 'wiki_treenav/pages')
  end
end
