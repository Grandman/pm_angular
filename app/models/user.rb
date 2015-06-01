class User < ActiveRecord::Base
  belongs_to :group
  has_many :comments
  has_and_belongs_to_many :tasks
  validates :first_name, :second_name, :email, :login, :password, presence: true

  def cost_per_hour
    self[:cost_per_hour] || self.group.cost_per_hour
  end
end
