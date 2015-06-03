class Comment < ActiveRecord::Base
  has_ancestry
  belongs_to :user
  belongs_to :task

  def subcomments
    descendants.arrange_serializable
  end
end
