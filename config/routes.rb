Rails.application.routes.draw do
  resources :puzzle_settings
  resources :game_sessons
  resources :words
  resources :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
