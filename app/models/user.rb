class User < ActiveRecord::Base
  belongs_to :group

  validates :first_name, :second_name, :email, :login, :password, presence: true
end
