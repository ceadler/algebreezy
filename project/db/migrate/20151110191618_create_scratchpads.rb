class CreateScratchpads < ActiveRecord::Migration
  def change
    create_table :scratchpads do |t|
      t.string :title
      t.references :owner
      t.boolean :public
      t.string :data
      t.references :sharedto, index: true, foreign_key: true
      t.datetime :creationtime

      t.timestamps null: false
    end
  end
end
