/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "zbm/parceiros/model/models"
],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("zbm.parceiros.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                //interceptação do evento RouteMatched usando o método attachRouteMatched
                let oRouter = this.getRouter();

                oRouter.attachRouteMatched(this.aoNavegar, this);

                //configura o modelo OData para ser bidirecional
                this.getModel().setDefaultBindingMode("TwoWay");
            },
            aoNavegar: function (oEvent) {
                let sLayout;

                //resgata a rota a ser usada na navegação
                let sRota = oEvent.getParameters().name;

                switch (sRota) {
                    case "RouteDetalhesParceiro":
                    case "RouteNovoParceiro":
                        sLayout = "TwoColumnsMidExpanded";
                        break;
                    case "RouteParceiros":
                        sLayout = "OneColumn";
                        break;
                }
                let oLayout = this.getModel("layout");
                oLayout.setProperty("/modoExibicao", sLayout);
            }
        });
    }
);