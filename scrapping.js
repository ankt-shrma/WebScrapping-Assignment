const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = 'https://www.neonearth.com/shop/clothing/vests.html';
    await page.goto(url);

    //Getting the list of all the creators on the page
    const creators = await page.evaluate(() =>
        Array.from(document.querySelectorAll("div.artist"))
            .map(creator => creator.textContent)
    );

    //Array for storing the names of all the creators uniquely
    let uniqueCreators = [];

    for (let i = 0; i < creators.length; i++) {
        if (uniqueCreators.indexOf(creators[i]) === -1) {
            uniqueCreators.push(creators[i]);
        }
    }


    //Getting the array of Price of all the items shown on the page
    const priceList = await page.evaluate(
        () => {
            return (
                Array.from(document.querySelectorAll("span.price"))
                    .map(price => (parseFloat(
                        (price.textContent).substring(1))
                    )
                    )
            )
        }
    );
    //Getting the total price of all the items shown on the page
    const totalPrice = await priceList.reduce((a, b) => a + b, 0);

    //Getting the number of links in the footer
    const linksInFooter = await page.evaluate(
        () => Array.from(document.querySelectorAll("div.mainfooter a")).length
    )

    //Getting the total number of submenus present in the menu "Clothing"
    const numberOfSubmenus = await page.evaluate(
        () => {
            const menus = Array.from(document.querySelectorAll("div .commercepundit_megamenu_title"));
            let found;
            const searchingWord = "Clothing";
            for (let i = 0; i < menus.length; i++) {
                if (menus[i].textContent === searchingWord) {
                    found = menus[i]; //Got the parent node with the name "Clothing" and stored it inside variable 'found'
                }
            }
            let parent = found.closest("li.other-toggle"); //Getting the parent element of menu "Clothing"
            const submenus = parent.querySelectorAll("a.commercepundit_megamenu_nodrop");
            return submenus.length;
        }
    )

    console.log("Unique Creators: " + uniqueCreators);
    console.log("totalPrice: " + totalPrice);
    console.log("Links in footer: " + linksInFooter);
    console.log("submenus: " + numberOfSubmenus);
    await browser.close();
})();