class CreateCommentsTasks < ActiveRecord::Migration
  def change
    create_table :comments_tasks do |t|
      t.belongs_to :comment
      t.belongs_to :task
    end
  end
end
