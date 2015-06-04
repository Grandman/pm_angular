class AddFinishedToProjects < ActiveRecord::Migration
  def change
    add_column :projects, :finished, :boolean
  end
end
