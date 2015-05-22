class Project < ActiveRecord::Base
  validates :title, :description, presence: true
end
