# frozen_string_literal: true

require File.expand_path('../../test_helper', __FILE__)

class WikiTest < Redmine::IntegrationTest
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
    projects(:projects_001).enable_module!(:wiki_treenav)
  end

  def test_wik_treenav_disabled
    projects(:projects_001).disable_module!(:wiki_treenav)

    log_user('admin', 'admin')

    get('/projects/ecookbook/wiki')

    assert_response :success
    assert_select '#wiki-treenav', count: 0
  end

  def test_wik_treenav_root
    log_user('admin', 'admin')

    get('/projects/ecookbook/wiki')

    assert_response :success
    assert_select '#wiki-treenav'
  end

  def test_wik_treenav_child
    log_user('admin', 'admin')

    get('/projects/ecookbook/wiki/CookBook_documentation')

    assert_response :success
    assert_select '#wiki-treenav'
  end
end
