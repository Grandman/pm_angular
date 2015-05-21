require 'rails_helper'

RSpec.describe 'projects', type: :request do
  context 'projects show' do
    it 'render page' do
      get "/api/projects/"
      expect(response).to be_success
    end
  end
end