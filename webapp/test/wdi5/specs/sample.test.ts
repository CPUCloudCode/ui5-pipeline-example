import Button from "sap/m/Button"
import { wdi5, wdi5Selector } from "wdio-ui5-service"

describe("samples", () => {
    it("should log", () => {
        const logger = wdi5.getLogger()
        logger.log("hello world!")
    })

    // intentionally skipping this as you have to adjust things to your UI5 app :)
    it("should retrieve a UI5 control", async () => {
        const button = await browser.$("button");  // Selektiert den ersten Button
        const buttonId = await button.getAttribute("id");
        console.log("Button ID:", buttonId);
        await browser.screenshot("Before-click");
        await (await browser.asControl({
            selector: {
                id: "application-sapbtphelloworldui5-display-component---View1--btn1",
                interaction: {
                    idSuffix: "content"
                }
            }
        })).press();
        await browser.screenshot("After-click");
        
    })
})
