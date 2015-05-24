FactoryGirl.define do
  factory :project do
    title { generate :string }
    description { generate :string }
  end
end