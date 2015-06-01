class AddHoursToTasks < ActiveRecord::Migration
  def change
    add_column :tasks, :plan_hours, :integer
    add_column :tasks, :actual_hours, :integer
  end
end
