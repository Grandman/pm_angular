class AddDateFieldsToTasks < ActiveRecord::Migration
  def change
    add_column :tasks, :start_date, :datetime
    add_column :tasks, :end_time, :datetime
  end
end
