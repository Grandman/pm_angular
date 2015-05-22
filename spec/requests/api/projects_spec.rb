require 'rails_helper'

RSpec.describe 'projects', type: :request do
  context 'projects show' do
    it 'render page' do
      get "/api/projects/"
      expect(response).to be_success
    end
  end
  context 'project show' do
    fixtures :projects
    it 'render page' do
      get "/api/projects/1"
      expect(response).to be_success
    end
  end
  context 'project create' do
    fixtures :projects
    let!(:project_attributes) { attributes_for :project }
    it 'render page' do
      post "/api/projects/", project: project_attributes
      expect(response).to be_success
    end
  end
end