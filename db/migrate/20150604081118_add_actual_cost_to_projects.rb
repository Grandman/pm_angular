class AddActualCostToProjects < ActiveRecord::Migration
  def change
    add_column :projects, :actual_cost, :integer, default: 0
  end
end
