Rails.application.routes.draw do
  get "users/:name", to: "users#findUser"
  resources :game_sessions
  resources :puzzle_settings
  resources :words
  resources :users

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
