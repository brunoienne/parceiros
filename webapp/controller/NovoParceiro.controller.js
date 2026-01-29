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

        return Controller.extend("zbm.parceiros.controller.NovoParceiro", {
            onInit: function () {

            },

            aoCancelar: function () {
                // cancelamento das alterações de tela
                let oModel = this.buscaModel("novoParceiro");
                //recarrega o arquivo novoParceiro.json para resetar informações
                oModel.loadData('./model/novoParceiro.json');
                //navega para rota inicial
                let oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteParceiros");
            },

            aoSalvar: function () {
                let oDados = {};

                //resgata os dados no modelo novoParceiro
                let oModelParceiro = this.buscaModel("novoParceiro").getProperty("/");

                oDados.PartnerType = oModelParceiro.PartnerType;
                oDados.PartnerName1 = oModelParceiro.PartnerName1;
                oDados.PartnerName2 = oModelParceiro.PartnerName2;
                oDados.SearchTerm1 = oModelParceiro.SearchTerm1;
                oDados.SearchTerm2 = oModelParceiro.SearchTerm2;
                oDados.Street = oModelParceiro.Street;
                oDados.HouseNumber = oModelParceiro.HouseNumber;
                oDados.District = oModelParceiro.District;
                oDados.City = oModelParceiro.City;
                oDados.ZipCode = oModelParceiro.ZipCode;
                oDados.Country = oModelParceiro.Country;
                oDados.Region = oModelParceiro.Region;

                //resgata o modelo oData vazio
                let oModel = this.getOwnerComponent().getModel();

                //efetua a chamada create
                oModel.setHeaders({ 'X-Requested-With': 'X' });
                oModel.create("/ParceiroSet", oDados, {
                    success: oResult => {
                        this.getView().setBusy(false);
                        let oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                        let sMsg = oBundle.getText("criado", oResult.PartnerId);
                        MessageToast.show(sMsg);

                        let oRouter = this.getOwnerComponent().getRouter();
                        oRouter.navTo("RouteParceiros");
                    },
                    error: oErro => {
                        this.getView().setBusy(false);
                        let sErro = JSON.parse(oErro.responseText).error.message.value;
                        MessageBox.error(sErro)
                    }
                })

            },

            aoEscolherCategoria: function (oEvent) {
                //item selecionado
                let oItem = oEvent.getParameters().selectedItem;
                //dados do modelo associado ao item
                let oDados = oItem.getBindingContext("novoParceiro").getObject();
                //resgata o modelo NovoParceiro
                let oModel = this.buscaModel("novoParceiro");
                oModel.setProperty("/PartnerType", oDados.PartnerType)
            },

            buscaModel: function (sModelo) {
                return this.getOwnerComponent().getModel(sModelo);
            }

        });
    });
