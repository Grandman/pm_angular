class Project < ActiveRecord::Base
  has_many :tasks
  # has_and_belongs_to_many :users
  belongs_to :company

  validates :title, :description, presence: true
end
