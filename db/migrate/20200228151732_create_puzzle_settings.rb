class CreatePuzzleSettings < ActiveRecord::Migration[6.0]
  def change
    create_table :puzzle_settings do |t|
      t.string :difficulty
      t.string :grid_size
      t.boolean :match_by
      t.integer :timer

      t.timestamps
    end
  end
end
