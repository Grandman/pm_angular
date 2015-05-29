class Task < ActiveRecord::Base
  belongs_to :project
  has_and_belongs_to_many :users

  validates :title, :description, presence: true
end
