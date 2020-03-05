class UsersController < ApplicationController
    def show
        user = User.find(params[:id])
        render json: user
    end
    
    def index
        users = User.all
        render json: users
    end
    
    def create
        user = User.create(user_params)
        
        render json: user
    end
    
    def findUser
        user = User.find_by(username: params[:name] )
        render json: user
    end

    def update
        user = User.find(params[:id])
        user.update(user_params)
        render json: user
    end

    def destroy
        user = User.find(params[:id])
        unless user.nil?
            user.destroy
            render json: user
          else
            render json: { error: "user not Found!" }, status: 404
          end
    end
    
    
     
    private
    def user_params
        params.require(:user).permit(:username)
    end

    # def username_params
    #     params.require(:user).permit(:name)
    # end

end
