class Group < ActiveRecord::Base
  has_many :users
  belongs_to :company

  validates :name, presence: true
end
