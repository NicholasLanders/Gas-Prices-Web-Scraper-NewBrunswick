function main() {
    let newVal = scrapeGasPrices("https://nbeub.ca/index.php?page=current-petroleum-prices-2");
    updateSheet(newVal);
  }
  
  function scrapeGasPrices(url) {
    let newVal = {};
    let html = UrlFetchApp.fetch(url).getContentText();
    let $ = Cheerio.load(html);
  

    newVal.gasPrice = $("#gasprices_inner h1").text();
    newVal.gasPrice = parseFloat(newVal.gasPrice);
    newVal.gasPrice = newVal.gasPrice.toFixed(1);
    
    // Off by an hour when daylight savings ends I believe
    newVal.timeStamp = Utilities.formatDate(new Date(), 'GMT-3:00', "yyyy-MM-dd HH:mm:ss");
    
    return newVal;
  }
  
  // Very specific to the way I do my budget in google sheets 
  function updateSheet(newVal) {
    let gasPrice = (newVal.gasPrice - 3.4) /100;
    let timeStamp = newVal.timeStamp;
    let priorGasPrice;
  
    // Removed personal sheet ID, which would go in the line below
    let budgetSheet = SpreadsheetApp.openById("");
    let sheet = budgetSheet.getSheets()[0];
    let finalBudgetCell = sheet.createTextFinder("Gas").findNext();
    finalBudgetCell = finalBudgetCell.offset(1, 0)
  
  
    let timeCell = finalBudgetCell.offset(1, 0);
    timeCell.setValue(timeStamp);
  
  
    let gasCell = finalBudgetCell.offset(3, 0);
    priorGasPrice = gasCell.getValue();
    gasCell.setValue(gasPrice);

    let priorGasCell = finalBudgetCell.offset(3,1);
    priorGasCell.setValue(priorGasPrice);
  }