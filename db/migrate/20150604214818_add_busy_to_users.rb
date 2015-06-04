class AddBusyToUsers < ActiveRecord::Migration
  def change
    add_column :users, :busy_from, :datetime
    add_column :users, :busy_to, :datetime, default: Date.today
  end
end
