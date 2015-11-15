class CreateSampleModels < ActiveRecord::Migration
  def change
    create_table :sample_models do |t|
      t.string :username
      t.string :message

      t.timestamps null: false
    end
  end
end
