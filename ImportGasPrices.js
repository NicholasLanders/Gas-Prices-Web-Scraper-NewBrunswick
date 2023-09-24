function main() {
    let newVal = scrapeGasPrices("https://nsuarb.novascotia.ca/mandates/gasoline-diesel-pricing/gasoline-prices-zone-map");
    updateSheet(newVal);
  }
  
  function scrapeGasPrices(url) {
    let newVal = {};
    let html = UrlFetchApp.fetch(url).getContentText();
    let $ = Cheerio.load(html);
  
    // Halifax is in zone 1
    newVal.gasPrice = $(".field--name-field-zone-1-unleaded-min").text();
    newVal.gasLastUpdated = "The last update was: " + $(".datetime").text();
    newVal.timeStamp = Utilities.formatDate(new Date(), 'Etc/GMT', "yyyy-MM-dd HH:mm:ss");
    
    return newVal;
  }
  
  // Very specific to the way I do my budget in google sheets 
  function updateSheet(newVal) {
    let litresOfGas = 39;
    let gasPrice = newVal.gasPrice /100;
    let timeStamp = newVal.timeStamp;
    let gasLastUpdated = newVal.gasLastUpdated;
    let finalBudgetGas;
  
    // To account for monthly gas, and also converting to proper number for dollars and cents
    finalBudgetGas = ((gasPrice * litresOfGas) * 2).toFixed(2);
    // Removed personal sheet ID, which would go in the line below
    let budgetSheet = SpreadsheetApp.openById("");
    let sheet = budgetSheet.getSheets()[0];
    let finalBudgetCell = sheet.createTextFinder("Gas").findNext();
    finalBudgetCell = finalBudgetCell.offset(1, 0)
    finalBudgetCell.setValue(finalBudgetGas);
  
    let timeCell = finalBudgetCell.offset(1, 0);
    timeCell.setValue(timeStamp);
  
    let lastUpdatedCell = finalBudgetCell.offset(2, 0);
    lastUpdatedCell.setValue(gasLastUpdated);
  
    let gasCell = finalBudgetCell.offset(3, 0);
    gasCell.setValue(gasPrice);
  }