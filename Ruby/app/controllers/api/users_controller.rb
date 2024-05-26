class Api::UsersController < ApplicationController
  before_action :set_user, only: [:show, :update, :destroy]
  def index
    @users = Usuario.all
    render json: @users
  end

  def show
    render json: @user
  end

  def create
    @user = Usuario.new(user_params)
    if @user.save
      render json: @user, status: :created
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def update
    if @user.update(user_params)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @user.destroy
  end
  
  private

  def set_user
    @user = Usuario.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:nome, :email)
  end
end
