# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
# puts "destroying game_sessions"
# GameSession.destroy_all
# puts "destroying users"
# User.destroy_all
# puts "destroying puzzle_settings"
# PuzzleSettings.destroy_all
puts "destroying words"
Word.destroy_all

const easyWords = []

def seedWords {
    easyWords.each{|word|
    Word.create(puzzle_setting_id: , word: word)
    }
}
