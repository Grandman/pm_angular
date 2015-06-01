class CreateCommentsUsers < ActiveRecord::Migration
  def change
    create_table :comments_users do |t|
      t.belongs_to :comment
      t.belongs_to :user
    end
  end
end
