sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, MessageBox) {
        "use strict";

        return Controller.extend("zbm.parceiros.controller.DetalheParceiro", {
            onInit: function () {
                //intercepta o evento routePatternMatched para resgatar o id do parceiro que está na URL
                let oRouter = this.getOwnerComponent().getRouter();
                let oRotaDesejada = oRouter.getRoute("RouteDetalhesParceiro")
                //quando o padrão da URL combinar com a rota especificada
                oRotaDesejada.attachPatternMatched(this.rotaDetalhe, this)
            },

            rotaDetalhe: function (oEvent) {

                //resgata o id do parceiro na URL
                let sId = oEvent.getParameters().arguments.PartnerId;
                //resgata o modelo
                let oModel = this.getOwnerComponent().getModel();
                //monta o caminho para o parceiro no serviço oData para fazer o Read
                let sPath = oModel.createKey("/ParceiroSet", {
                    PartnerId: sId
                });

                //vincular o caminho com a View, para disponibilizar as propriedades via binding
                this.getView().bindElement(sPath);
            },

            aoEditar: function () {

                this.getView().byId("btnEdit").setVisible(false);
                this.getView().byId("btnSave").setVisible(true);
                this.getView().byId("btnCancel").setVisible(true);

                let oEdicao = this.getOwnerComponent().getModel("modo");
                oEdicao.setProperty("/editavel", true);
                oEdicao.setProperty("/visivel", true);

            },

            aoCancelar: function () {
                this.getView().byId("btnEdit").setVisible(true);
                this.getView().byId("btnSave").setVisible(false);
                this.getView().byId("btnCancel").setVisible(false);

                let oEdicao = this.getOwnerComponent().getModel("modo");
                oEdicao.setProperty("/editavel", false);

                // cancelamento das alterações de tela
                this.getOwnerComponent().getModel().resetChanges();
            },

            aoSalvar: function () {

                this.getView().setBusy(true);

                //resgata o objeto com dados
                let oObject = this.getView().getBindingContext().getObject();

                //resgata o caminho para a requisição
                let sPath = this.getView().getBindingContext().getPath();

                //resgata o modelo
                let oModel = this.getOwnerComponent().getModel();
                oModel.setHeaders({ 'X-Requested-With': 'X' });
                oModel.sdefaultUpdateMethod = "PUT";

                //dispara a requisição PUT
                oModel.update(sPath, oObject, {
                    success: oResult => {
                        this.getView().setBusy(false);
                        let oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                        let sMsg = oBundle.getText("sucesso", [oObject.PartnerId]);
                        this.getView().byId("btnEdit").setVisible(true);
                        this.getView().byId("btnSave").setVisible(false);
                        this.getView().byId("btnCancel").setVisible(false);
                        let oEdicao = this.getOwnerComponent().getModel("modo");
                        oEdicao.setProperty("/editavel", false);
                        MessageToast.show(sMsg);

                    },
                    error: oErro => {
                        this.getView().setBusy(false);
                        let sErro = JSON.parse(oErro.responseText).error.message.value;
                        MessageBox.error(sErro)
                    }
                })
            }

        });
    });
