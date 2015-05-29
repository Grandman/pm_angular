class User < ActiveRecord::Base
  belongs_to :group
  has_and_belongs_to_many :tasks
  validates :first_name, :second_name, :email, :login, :password, presence: true
end
