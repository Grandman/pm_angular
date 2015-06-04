require 'rails_helper'

RSpec.describe 'users', type: :request do
  context 'user show' do
    let!(:company){ create :company, id: 1 }
    let!(:user) { create :user, id: 1 }
    it 'render page' do
      get "/api/users/1"
      expect(response).to be_success
    end
  end
  context 'user create' do
    let!(:company){ create :company, id: 1 }
    let(:user_attributes) { attributes_for :user}
    it 'success if valid user' do
      post "/api/users/", user: user_attributes
      expect(response).to be_success
    end

    it 'error if not valid' do
      post "/api/users/", user: { first_name: nil }
      expect(response).to have_http_status(422)
    end
  end

  context 'user update' do
    let!(:company){ create :company, id: 1 }
    let!(:user) { create :user, id: 1 }
    let!(:user_attributes) { attributes_for :user }
    it 'success if valid user params' do
      patch "/api/users/1", user: user_attributes
      expect(response).to be_success
    end

    it 'error if not valid user params' do
      patch "/api/users/1", user: { first_name: nil }
      expect(response).to have_http_status(422)
    end
  end
end
