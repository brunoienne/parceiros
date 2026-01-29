sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("zbm.parceiros.controller.Parceiros", {
            onInit: function () {
                this.getOwnerComponent().getModel().setSizeLimit(999);
            },
            aoDigitar: function (oEvent) {
                //resgata a string de pesquisa
                let sPesquisa = oEvent.getParameters().newValue;

                //configura o array de filtros com uma nova entrada pelo Id do parceiro(PartnerId)
                //let aFilters = [];
                /*                 aFilters.push(
                                    new Filter({
                                        path: "PartnerId",
                                        operator: FilterOperator.Contains,
                                        value1: sPesquisa
                                    })
                                );
                
                                aFilters.push(
                                    new Filter({
                                        path: "PartnerName1",
                                        operator: FilterOperator.Contains,
                                        value1: sPesquisa
                                    })
                                ); */

                let oFilters = new Filter({
                    filters: [
                        new Filter({ path: "PartnerName1", operator: FilterOperator.Contains, value1: sPesquisa }),
                    ],
                    and: false
                })

                //Resgata a lista
                let oParceiros = this.getView().byId("listaParceiros");

                //Resgata a classe de binding, onde há o método filter
                let oBinding = oParceiros.getBinding("items");

                //chamado o método filter
                oBinding.filter(oFilters);
            },

            aoSelecionarParceiro: function (oEvent) {
                let oItem = oEvent.getParameters().listItem;
                let oBinding = oItem.getBindingContext();
                let oDados = oBinding.getObject();
                let oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteDetalhesParceiro", {
                    PartnerId: oDados.PartnerId
                })
            },

            criarBP: function () {
                let oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteNovoParceiro")
            }

        });
    });
