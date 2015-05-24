class Task < ActiveRecord::Base
  belongs_to :project

  validates :title, :description, presence: true
end
