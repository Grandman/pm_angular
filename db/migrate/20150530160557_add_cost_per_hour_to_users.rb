class AddCostPerHourToUsers < ActiveRecord::Migration
  def change
    add_column :users, :cost_per_hour, :integer
  end
end
