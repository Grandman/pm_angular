class CreateTasksUsers < ActiveRecord::Migration
  def change
    create_table :tasks_users do |t|
      t.belongs_to :task
      t.belongs_to :user
    end
  end
end
