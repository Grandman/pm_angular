class AddCostPerHourToGroups < ActiveRecord::Migration
  def change
    add_column :groups, :cost_per_hour, :integer
  end
end
