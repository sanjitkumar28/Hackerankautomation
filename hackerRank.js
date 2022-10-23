const puppeteer = require("puppeteer");
const secert=require('./secert.js')
const email=secert.email;
const password=secert.password;
let curTab;
let { answer } = require("./codes");

let browserOpenPromise = puppeteer.launch({
  headless: false,
  defaultViewport: null,
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
});

browserOpenPromise
  .then(function (browser) {
    console.log("browser is open");
    let allTabsPromise = browser.pages();
    return allTabsPromise;
  })
  .then(function (allTabsArr) {
    curTab = allTabsArr[0];
    let vistingLoginPagePromise = curTab.goto(
      "https://www.hackerrank.com/auth/login"
    );
    return vistingLoginPagePromise;
  })
  .then(function (data) {
    console.log("hackerrank page is opened");
    let emailWillBeTypedPromise = curTab.type("#input-1", email);
    return emailWillBeTypedPromise;
  })
  .then(function () {
    console.log("email is typed");
    let passwordWillBeTypedPromise = curTab.type("#input-2", password);
    return passwordWillBeTypedPromise;
  })
  .then(function () {
    console.log("password has been typed");
    const willBeLoggedIn = curTab.click(
      ".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled"
    );
    return willBeLoggedIn;
  })
  .then(function () {
    console.log("logged into hackerrank successfully");
    const willClickAlgorithmPage = waitAndClickOnAlgoPage(
      "div[data-automation='algorithms']"
    );
    return willClickAlgorithmPage;
  })
  .then(function () {
    console.log("Algorithm page is opened");
    let allQuestionPromise = curTab.waitForSelector(
      'a[data-analytics="ChallengeListChallengeName"]'
    );
    return allQuestionPromise;
  })
  .then(function () {
    function getAllQuesLinks() {
      let allElemArr = document.querySelectorAll(
        'a[data-analytics="ChallengeListChallengeName"]'
      );
      let linksArr = [];
      for (let i = 0; i < allElemArr.length; i++) {
        linksArr.push(allElemArr[i].getAttribute("href"));
      }
      return linksArr;
    }
    let linksArrPromise = curTab.evaluate(getAllQuesLinks);
    return linksArrPromise;
  })
  .then(function (linksArr) {
    console.log("links to all ques received");
    let questionWillBeSolvedPromise = questionSolver(linksArr[0], 0);
    for (let i = 1; i < linksArr.length; i++) {
      questionWillBeSolvedPromise = questionWillBeSolvedPromise.then(
        function () {
          return questionSolver(linksArr[i], i);
        }
      );
    }
    return questionWillBeSolvedPromise;
  });
function waitAndClickOnAlgoPage(algoBtn) {
  const clickOnAlgoPromise = new Promise(function (resolve, reject) {
    const waitForSelectorPromise = curTab.waitForSelector(algoBtn);
    waitForSelectorPromise
      .then(function () {
        console.log("algo button is found");
        const algoButtonIsClickPromise = curTab.click(algoBtn);
        return algoButtonIsClickPromise;
      })
      .then(function () {
        console.log("Algo button is click");
        resolve();
      })
      .catch(function (err) {
        console.log(err);
      });
  });
  return clickOnAlgoPromise;
}

function questionSolver(url, index) {
  return new Promise(function (resolve, reject) {
    let fullURL = `https://www.hackerrank.com${url}`;
    let goToQuestionPageLinkPromise = curTab.goto(fullURL);
    goToQuestionPageLinkPromise
      .then(function () {
        console.log("question opened");
        const waitForCheckboxAndClickPromise =
          waitAndClickOnAlgoPage(".checkbox-input");
        return waitForCheckboxAndClickPromise;
      })
      .then(function () {
        const waitForTextBoxPromise = curTab.waitForSelector(".custominput");
        return waitForTextBoxPromise;
      })
      .then(function () {
        let codeWillBeTypedPromise = curTab.type(
          ".custominput",
          answer[index],
          {
            delay: 100,
          }
        );
        return codeWillBeTypedPromise;
      })
      .then(function () {
        console.log("code is typed");
      })
      .then(function () {
        let controlPressedPromise = curTab.keyboard.down("Control");
        return controlPressedPromise;
      })
      .then(function () {
        let aKeyPressed = curTab.keyboard.press("a");
        return aKeyPressed;
      })
      .then(function () {
        let xKeyPressed = curTab.keyboard.press("x");
        return xKeyPressed;
      })
      .then(function () {
        const controlIsReleasePromise = curTab.keyboard.up("Control");
        return controlIsReleasePromise;
      })
      .then(function () {
        let submitButtonClickedPromise = curTab.click(
          ".hr-monaco-editor-with-input"
        );
        return submitButtonClickedPromise;
      })
      .then(function () {
        const controlIsReleasePromise = curTab.keyboard.down("Control");
        return controlIsReleasePromise;
      })
      .then(function () {
        const aKeyPressed = curTab.keyboard.press("A");
        return aKeyPressed;
      })
      .then(function () {
        const vKeyPressed = curTab.keyboard.press("V");
        return vKeyPressed;
      })
      .then(function () {
        let controlDownPromise = curTab.keyboard.up("Control");
        return controlDownPromise;
      })
      .then(function () {
        let submitButtonClickedPromise = curTab.click(".hr-monaco-submit");
        return submitButtonClickedPromise;
      })
      .then(function () {
        console.log("code submitted successfully");
        resolve();
      });
  });
}


