# frozen_string_literal: true

require File.expand_path('../../test_helper', __FILE__)

class WikiTreenavControllerTest < ActionController::TestCase
  include Redmine::I18n

  fixtures :enabled_modules,
           :member_roles,
           :members,
           :projects,
           :roles,
           :users,
           :wiki_content_versions,
           :wiki_contents,
           :wiki_pages,
           :wikis

  def setup
    @request.session[:user_id] = 2

    @project = projects(:projects_001)
    @project.enable_module!(:wiki_treenav)

    @page = wiki_pages(:wiki_pages_001)
  end

  def test_pages
    get :pages, params: {
      project_id: @project.id,
      id: @page.id,
    }

    assert_response :success
    assert_select 'a.icon-collapsed'
    assert_select 'a.icon-add'
  end

  def test_pages_no_perm_edit
    role = Role.find(1)
    role.remove_permission! :edit_wiki_pages

    get :pages, params: {
      project_id: @project.id,
      id: @page.id,
    }

    assert_response :success
    assert_select 'a.icon-collapsed'
    assert_select 'a.icon-add', count: 0
  end

  def test_pages_no_perm_view
    role = Role.find(1)
    role.remove_permission! :view_wiki_pages

    get :pages, params: {
      project_id: @project.id,
      id: @page.id,
    }

    assert_response :forbidden
  end
end
