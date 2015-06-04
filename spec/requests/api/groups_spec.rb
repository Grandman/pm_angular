require 'rails_helper'

RSpec.describe 'groups', type: :request do
  context 'groups show' do
    it 'render page' do
      get "/api/groups/"
      expect(response).to be_success
    end
  end

  context 'group show' do
    let!(:company){ create :company, id: 1 }
    let!(:group) { create :group, id: 1 }
    it 'render page' do
      get "/api/groups/1"
      expect(response).to be_success
    end
  end

  context 'group create' do
    let!(:company){ create :company, id: 1 }
    let!(:group_attributes) { attributes_for :group }
    it 'success if valid group' do
      post "/api/groups/", group: group_attributes
      expect(response).to be_success
    end

    it 'error if not valid' do
      post "/api/groups/", group: { name: nil, company_id: 1 }
      expect(response).to have_http_status(422)
    end
  end

  context 'group update' do
    let!(:company){ create :company, id: 1 }
    let!(:group) { create :group, id: 1 }
    let!(:group_attributes) { attributes_for :group }
    it 'success if valid group params' do
      patch "/api/groups/1", group: group_attributes
      expect(response).to be_success
    end

    it 'error if not valid group params' do
      patch "/api/groups/1", group: { name: nil }
      expect(response).to have_http_status(422)
    end
  end
end
