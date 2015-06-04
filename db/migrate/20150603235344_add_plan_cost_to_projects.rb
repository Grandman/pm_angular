class AddPlanCostToProjects < ActiveRecord::Migration
  def change
    add_column :projects, :plan_cost, :integer
  end
end
