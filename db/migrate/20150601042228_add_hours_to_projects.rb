class AddHoursToProjects < ActiveRecord::Migration
  def change
    add_column :projects, :plan_hours, :integer
    add_column :projects, :actual_hours, :integer
  end
end
