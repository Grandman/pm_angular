class Project < ActiveRecord::Base
  has_many :tasks
  # has_and_belongs_to_many :users
  belongs_to :company

  validates :title, :description, presence: true

  def tasks_count
    self.tasks.count
  end
  def tasks_finished_count
    self.tasks.where(finished: true).count
  end
end
