# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150604214818) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "comments", force: :cascade do |t|
    t.string   "text"
    t.integer  "user_id"
    t.integer  "task_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "ancestry"
  end

  add_index "comments", ["ancestry"], name: "index_comments_on_ancestry", using: :btree
  add_index "comments", ["task_id"], name: "index_comments_on_task_id", using: :btree
  add_index "comments", ["user_id"], name: "index_comments_on_user_id", using: :btree

  create_table "comments_tasks", force: :cascade do |t|
    t.integer "comment_id"
    t.integer "task_id"
  end

  create_table "comments_users", force: :cascade do |t|
    t.integer "comment_id"
    t.integer "user_id"
  end

  create_table "companies", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "groups", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.integer  "cost_per_hour"
    t.integer  "company_id"
  end

  add_index "groups", ["company_id"], name: "index_groups_on_company_id", using: :btree

  create_table "projects", force: :cascade do |t|
    t.string   "title"
    t.string   "description"
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.datetime "start_date"
    t.datetime "end_time"
    t.integer  "plan_hours"
    t.integer  "actual_hours"
    t.integer  "company_id"
    t.integer  "plan_cost"
    t.boolean  "finished"
    t.integer  "actual_cost",  default: 0
  end

  add_index "projects", ["company_id"], name: "index_projects_on_company_id", using: :btree

  create_table "projects_users", force: :cascade do |t|
    t.integer "project_id"
    t.integer "user_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.string   "title"
    t.string   "description"
    t.integer  "project_id"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.datetime "start_date"
    t.datetime "end_time"
    t.integer  "plan_hours"
    t.integer  "actual_hours"
    t.string   "ancestry"
    t.boolean  "finished",     default: false
  end

  add_index "tasks", ["ancestry"], name: "index_tasks_on_ancestry", using: :btree
  add_index "tasks", ["project_id"], name: "index_tasks_on_project_id", using: :btree

  create_table "tasks_users", force: :cascade do |t|
    t.integer "task_id"
    t.integer "user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string   "first_name"
    t.string   "second_name"
    t.string   "login"
    t.string   "email"
    t.string   "password"
    t.integer  "group_id"
    t.datetime "created_at",                                          null: false
    t.datetime "updated_at",                                          null: false
    t.string   "photo_url"
    t.integer  "cost_per_hour"
    t.string   "phone"
    t.integer  "company_id"
    t.integer  "finished_task_count", default: 0
    t.boolean  "manager",             default: false
    t.datetime "busy_from"
    t.datetime "busy_to",             default: '2015-06-05 00:00:00'
  end

  add_foreign_key "comments", "tasks"
  add_foreign_key "comments", "users"
  add_foreign_key "groups", "companies"
  add_foreign_key "projects", "companies"
  add_foreign_key "tasks", "projects"
  add_foreign_key "users", "groups"
end
