require 'rails_helper'

RSpec.describe 'tasks', type: :request do
  context 'tasks show' do
    it 'render page' do
      get "/api/projects/1/tasks/"
      expect(response).to be_success
    end
  end
  context 'task show' do
    let!(:task) { create :task, id: 1 }
    it 'render page' do
      get "/api/projects/1/tasks/1"
      expect(response).to be_success
    end
  end
  context 'task create' do
    let(:task_attributes) { attributes_for :task }
    it 'success if valid project' do
      post "/api/projects/1/tasks/", task: task_attributes
      expect(response).to be_success
    end
    it 'error if not valid' do
      post "/api/projects/1/tasks/", task: { test: 'test' }
      expect(response).to have_http_status(422)
    end
  end
  context 'task update' do
    let!(:task) { create :task, id: 1 }
    let(:task_attributes) { attributes_for :task }
    it 'success if valid project' do
      patch "/api/projects/1/tasks/1", task: task_attributes
      expect(response).to be_success
    end

    it 'error if not valid task params' do
      patch "/api/projects/1/tasks/1", task: {title: nil}
      expect(response).to have_http_status(422)
    end
  end
end
