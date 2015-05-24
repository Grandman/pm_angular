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
    let(:project_attributes) { attributes_for :project }
    it 'success if valid project' do
      post "/api/projects/", project: project_attributes
      expect(response).to be_success
    end

    it 'error if not valid' do
      post "/api/projects/", project: { test: 'test' }
      expect(response).to have_http_status(422)
    end
  end
  context 'project update' do
    let!(:project) { create :project }
    let(:project_attributes) { attributes_for :project }
    it 'success if valid project' do
      patch "/api/projects/1", project: project_attributes
      expect(response).to be_success
    end

    it 'error if not valid project params' do
      patch "/api/projects/1", project: {title: nil}
      expect(response).to have_http_status(422)
    end
  end
end