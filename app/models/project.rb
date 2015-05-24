class Project < ActiveRecord::Base
  has_many :tasks
  
  validates :title, :description, presence: true
end
