class UsuariosController < ApplicationController
  def new
    @usuario = Usuario.new
  end

  def create
    @usuario = Usuario.new(usuario_params)
    if @usuario.save
      redirect_to root_path, notice: "Usuário cadastrado com sucesso!"
    else
      render :new
    end
  end

  private

  def usuario_params
    params.require(:usuario).permit(:nome, :email)
  end
end