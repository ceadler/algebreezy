class Scratchpad < ActiveRecord::Base
  has_many :sharedto, class_name: "User"
end
