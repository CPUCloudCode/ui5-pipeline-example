import Button from "sap/m/Button"
import { wdi5, wdi5Selector } from "wdio-ui5-service"
import _ui5Service from "wdio-ui5-service";
const ui5Service = new _ui5Service();
describe("samples", () => {
    it("should log", () => {
        const logger = wdi5.getLogger()
        logger.log("hello world!")
    })

    it("should authenticate", async () => {
        console.log("🔄 Warte auf Login-Seite...");
        await browser.saveScreenshot("./screenshotX.png")
        await browser.waitUntil(async () => {
            return await browser.$("#j_username").isDisplayed();
        }, {
            timeout: 10000,
            timeoutMsg: "❌ Benutzername-Feld wurde nicht gefunden!"
        });
        console.log("🔗 Aktuelle URL:", await browser.getUrl());

        console.log("📝 Benutzername eingeben...");
        await browser.$("#j_username").setValue("lenni.meissner@gmail.com");
        await browser.saveScreenshot("./username.png")
        await browser.$("#logOnFormSubmit").click();
    
        console.log("🔄 Warte auf zweite Login-Seite...");
        await browser.pause(3000); // Warte, falls UI langsam reagiert
        console.log("🔗 Aktuelle URL:", await browser.getUrl());
        console.log("📝 Passwort eingeben...");
        await browser.waitUntil(async () => {
            return await browser.$("#password").isDisplayed();
        }, {
            timeout: 10000,
            timeoutMsg: "❌ Passwortfeld wurde nicht gefunden!"
        });
        const cookieButton = await browser.$("#truste-consent-button");
        await cookieButton.click();
        console.log("✅ Cookie-Banner akzeptiert!");
        await browser.pause(5000)
        await browser.$("#password").setValue("Acc4lenni#SAP");
        await browser.saveScreenshot("./password.png")
        await browser.waitUntil(async () => {
            return await browser.$("button.uid-login-as__submit-button").isClickable();
        }, {
            timeout: 10000,
            timeoutMsg: "❌ Der Sign-in-Button ist nach 10 Sekunden immer noch nicht klickbar!"
        });
        console.log("🔘 Klicke auf 'Sign in'...");
        const signInButton = await browser.$("button.uid-login-as__submit-button");
        await signInButton.click();
        await browser.pause(15000);
        console.info("Setup page...");
        console.log("🔗 Aktuelle URL:", await browser.getUrl());
        await browser.saveScreenshot("./screenshot.png")
        console.log("After screenshot");
        try {
            await browser.waitUntil(
                async () => await browser.execute(() => document.readyState === "complete"),
                {
                    timeout: 20000,
                    interval: 500,
                    timeoutMsg: "Die Seite hat sich nicht innerhalb des Timeouts vollständig geladen."
                }
            );
        } catch (oError) {
            console.error(oError);
            await browser.screenshot("Site loading timeout");
        }
        await browser.pause(1000);
        // Retrieve UI5 version
        const sUi5Version = await browser.execute(() => {
            try {
                const oVersionInfo = sap.ui.getVersionInfo() as any;
                return oVersionInfo?.version || "Unknown Version";
            } catch (oError) {
                throw new Error("UI5 version could not be retrieved. SAP UI5 not initialized.");
            }
        });
        if (sUi5Version === null) {
            console.warn(`UI5 version could not be found (${sUi5Version}).`);
            await browser.screenshot("WARNING-UI5-Version-not-found");
        } else {
            console.log(`Found UI Version: ${sUi5Version}`);
        }
        // Check if `wdi5` is undefined
        const bIsWdi5Undefined = await browser.execute(() => typeof (window as any).wdi5 === 'undefined');
        // Inject UI5 if `wdi5` is not available
        if (bIsWdi5Undefined) {
            console.log('Injecting UI5 as wdi5 is undefined in the browser.');
            await ui5Service.injectUI5();
        } else {
            await browser.screenshot("UI-Version-not-found");
            console.warn('wdi5 is already defined in the browser, no injection needed.');
        }
        await browser.waitUntil(
            () => browser.execute(() => (window as any).wdi5 !== undefined),
            {
                timeout: 5000,
                timeoutMsg: "window.wdi5 was not defined after injection"
            }
        );
    
        console.log("✅ Login abgeschlossen!");
    });

    // intentionally skipping this as you have to adjust things to your UI5 app :)
    it("should retrieve a UI5 control", async () => {
        const button = await browser.$("button");  // Selektiert den ersten Button
        const buttonId = await button.getAttribute("id");
        console.log("Button ID:", buttonId);
        await browser.screenshot("Before-click");
        await (await browser.asControl({
            selector: {
                id: new RegExp("---View1--btn1"),
                interaction: {
                    idSuffix: "content"
                }
            }
        })).press();
        await browser.screenshot("After-click");
        
    })
})
