class AddFinishedTaskCountToUsers < ActiveRecord::Migration
  def change
    add_column :users, :finished_task_count, :integer, default: 0
  end
end
