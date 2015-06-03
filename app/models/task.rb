class Task < ActiveRecord::Base
  has_ancestry
  belongs_to :project
  has_many :comments
  has_and_belongs_to_many :users

  validates :title, :description, presence: true

  def children_count
    descendants.count
  end

  def subtasks
    descendants.arrange_serializable
  end

end
