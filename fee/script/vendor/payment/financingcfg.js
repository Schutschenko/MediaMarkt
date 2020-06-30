financingCFG = new Object();
var laufzeit = new Array(10, 12, 18, 24, 30, 36, 42, 48, 60, 72);
var anzahl_zeilen = 24;
var c_count = 4; // standard count for campaign durations (first x values of list are 0%)
var interest = 99;
var sollzins = Math.floor((Math.pow((1 + interest / 10 / 100), (1 / 12)) - 1) * 12 * 100 * 100) / 100;

financingCFG.formatCurrency = function(num) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num)) num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(Math.round(num * 100));
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10) cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + '.' + num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + num + ',' + cents);
}

formatGesamt = function(gesamtbetrag, summa) {
    if (gesamtbetrag >= summa) return "&euro; " + financingCFG.formatCurrency(gesamtbetrag);
    else return "&euro; " + financingCFG.formatCurrency(summa);
}
sortElements = function(a, b) {
    var x = a[0];
    var y = b[0];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}
calculateMonthlyRate = function(summa, interest, months) {
    return summa * Math.pow((Math.pow((interest / 10 / 100 + 1), (1 / 12))), months) / ((Math.pow(((Math.pow((interest / 10 / 100 + 1), (1 / 12)))), months)) - 1) * ((Math.pow((interest / 10 / 100 + 1), (1 / 12))) - 1);
}
calculateWholeSum = function(summa, interest, months) {
    return Math.floor((summa * Math.pow((Math.pow((interest / 10 / 100 + 1), (1 / 12))), months) / ((Math.pow(((Math.pow((interest / 10 / 100 + 1), (1 / 12)))), months)) - 1) * ((Math.pow((interest / 10 / 100 + 1), (1 / 12))) - 1)) * 100) / 100 * months;
}

financingCFG.getCalculatedValueTable = function(summa, campaign, campaignduration, minSum, mincampaignduration, maxcampaignduration) {

    // check, if mincampaignduration, maxcampaignduration are used
    if (campaign == 9 && mincampaignduration != 0 && maxcampaignduration != 0 && maxcampaignduration > mincampaignduration) {
        anzahl_zeilen = maxcampaignduration - mincampaignduration + 1;
        c_count = anzahl_zeilen;
        campaignduration = "";
        laufzeit = new Array(anzahl_zeilen);
        for (var i = 0; i < (anzahl_zeilen); i++) {
            var tmp = mincampaignduration - 0 + i;
            laufzeit[i] = tmp;
        }
    }
    if (campaign == 9 && maxcampaignduration <= mincampaignduration) return;

    // check, if campaignduration is a standard lz
    var campaignduration_drin = false;
    if (campaignduration != "") {
        for (k = 0; k < laufzeit.length; k++) {
            if (laufzeit[k] == campaignduration) {
                campaignduration_drin = true;
                k = laufzeit.length;
            }
        }
    }

    var gesamtbetrag = 0;
    var anzahl = 0;
    var result;
    if ((campaign == 1 || campaign == 9) && (campaignduration == "99" || campaignduration == "")) {
        anzahl = c_count;
        result = new Array(anzahl);
    } else if ((campaign == 1 || campaign == 2) && campaignduration_drin == false && campaignduration != "") {
        anzahl = laufzeit.length;
        result = new Array(anzahl + 1);
    } else if (campaign == 3) {
        anzahl = 1;
        result = new Array(anzahl);
    } else {
        anzahl = laufzeit.length;
        result = new Array(anzahl);
    }

    for (i = 0; i < anzahl; i++) {
        var show = false;
        var showRow = false;
        var sz = '',
            gesamt = '',
            res = '',
            mon = '';

        if (parseFloat(summa) < minSum) show = false;
        else show = true;

        if (campaign == 0) {
            mon = calculateMonthlyRate(summa, interest, laufzeit[i]);
            gesamtbetrag = calculateWholeSum(summa, interest, laufzeit[i]);
            res = "&euro; " + financingCFG.formatCurrency(mon);
            gesamt = formatGesamt(gesamtbetrag, summa);
            showRow = (mon >= 10 && show) ? true : false;
            arr2 = new Array(res, gesamt, financingCFG.formatCurrency(sollzins) + ' %', financingCFG.formatCurrency(interest / 10) + ' %', showRow);
            result[i] = new Array(laufzeit[i], arr2);
        } else if (campaign == 1 || campaign == 9) {
            switch (campaignduration) {
                case "0":
                    /* show all 0% lz, rest 9.9% */
                    if (i <= 3) {
                        mon = Math.floor((summa * 100 / laufzeit[i])) / 100;
                        gesamtbetrag = summa;
                        res = "&euro; " + financingCFG.formatCurrency(mon);
                        gesamt = formatGesamt(gesamtbetrag, summa);
                        showRow = (mon >= 10 && show) ? true : false;
                        arr2 = new Array(res, gesamt, '0.00 %', '0.00 %', showRow);
                        result[i] = new Array(laufzeit[i], arr2);
                    } else {
                        mon = calculateMonthlyRate(summa, interest, laufzeit[i]);
                        gesamtbetrag = calculateWholeSum(summa, interest, laufzeit[i]);
                        res = "&euro; " + financingCFG.formatCurrency(mon);
                        gesamt = formatGesamt(gesamtbetrag, summa);
                        showRow = (mon >= 10 && show) ? true : false;
                        arr2 = new Array(res, gesamt, financingCFG.formatCurrency(sollzins) + ' %', financingCFG.formatCurrency(interest / 10) + ' %', showRow);
                        result[i] = new Array(laufzeit[i], arr2);
                    }
                    break;
                case "99":
                    ; /* show next ( only all 0% lz) */
                case "":
                    /* show only all 0% lz */
                    if (i < c_count) {
                        mon = Math.floor((summa * 100 / laufzeit[i])) / 100;
                        gesamtbetrag = summa;
                        res = "&euro; " + financingCFG.formatCurrency(mon);
                        gesamt = formatGesamt(gesamtbetrag, summa);
                        showRow = (mon >= 10 && show) ? true : false;
                        arr2 = new Array(res, gesamt, '0.00 %', '0.00 %', showRow);
                        result[i] = new Array(laufzeit[i], arr2);
                    }
                    break;
                default:
                    /* show campaignduration 0%, rest 9.9% */
                    if (laufzeit[i] == campaignduration) {
                        mon = Math.floor((summa * 100 / laufzeit[i])) / 100;
                        gesamtbetrag = summa;
                        res = "&euro; " + financingCFG.formatCurrency(mon);
                        gesamt = formatGesamt(gesamtbetrag, summa);
                        showRow = (mon >= 10 && show) ? true : false;
                        arr2 = new Array(res, gesamt, '0.00 %', '0.00 %', showRow);
                        result[i] = new Array(laufzeit[i], arr2);
                    } else {
                        mon = calculateMonthlyRate(summa, interest, laufzeit[i]);
                        gesamtbetrag = calculateWholeSum(summa, interest, laufzeit[i]);
                        res = "&euro; " + financingCFG.formatCurrency(mon);
                        gesamt = formatGesamt(gesamtbetrag, summa);
                        showRow = (mon >= 10 && show) ? true : false;
                        arr2 = new Array(res, gesamt, financingCFG.formatCurrency(sollzins) + ' %', financingCFG.formatCurrency(interest / 10) + ' %', showRow);
                        result[i] = new Array(laufzeit[i], arr2);
                    }

                    /* add extra lz not in standard range. attention: result must be sorted afterwards! */
                    if (!campaignduration_drin && campaignduration != "" && i == laufzeit.length - 1) {
                        mon = Math.floor((summa * 100 / campaignduration)) / 100;
                        gesamtbetrag = summa;
                        res = "&euro; " + financingCFG.formatCurrency(mon);
                        gesamt = formatGesamt(gesamtbetrag, summa);
                        showRow = (mon > 10 && campaignduration >= 6 && campaignduration <= 72 && show) ? true : false;
                        arr2 = new Array(res, gesamt, '0.00 %', '0.00 %', showRow);
                        result[laufzeit.length] = new Array(campaignduration, arr2);
                    }
                    break;
            }
        } else if (campaign == 2) {
            /* show until campaignduration lz 0%, rest 9.9% */
            if (campaignduration != '' && laufzeit[i] <= campaignduration || campaignduration == '' && i <= c_count - 1) {
                mon = Math.floor((summa * 100 / laufzeit[i])) / 100;
                gesamtbetrag = summa;
                res = "&euro; " + financingCFG.formatCurrency(mon);
                gesamt = formatGesamt(gesamtbetrag, summa);
                showRow = (mon >= 10 && show) ? true : false;
                arr2 = new Array(res, gesamt, '0.00 %', '0.00 %', showRow);
                result[i] = new Array(laufzeit[i], arr2);
            } else {
                mon = calculateMonthlyRate(summa, interest, laufzeit[i]);
                gesamtbetrag = calculateWholeSum(summa, interest, laufzeit[i]);
                res = "&euro; " + financingCFG.formatCurrency(mon);
                gesamt = formatGesamt(gesamtbetrag, summa);
                showRow = (mon >= 10 && show) ? true : false;
                arr2 = new Array(res, gesamt, financingCFG.formatCurrency(sollzins) + ' %', financingCFG.formatCurrency(interest / 10) + ' %', showRow);
                result[i] = new Array(laufzeit[i], arr2);
            }
            /* add extra lz not in standard range. attention: result must be sorted afterwards! */
            if (!campaignduration_drin && campaignduration != "" && i == laufzeit.length - 1) {
                mon = Math.floor((summa * 100 / campaignduration)) / 100;
                gesamtbetrag = summa;
                res = "&euro; " + financingCFG.formatCurrency(mon);
                gesamt = formatGesamt(gesamtbetrag, summa);
                showRow = (mon > 10 && campaignduration >= 6 && campaignduration <= 72 && show) ? true : false;
                arr2 = new Array(res, gesamt, '0.00 %', '0.00 %', showRow);
                result[laufzeit.length] = new Array(campaignduration, arr2);
            }
        } else if (campaign == 3) {
            /* show only campaignduration lz 0%, incl. ungerade lz */
            if (campaignduration >= 6 && campaignduration <= 72) {
                mon = Math.floor((summa * 100 / campaignduration)) / 100;
                gesamtbetrag = summa;
                res = "&euro; " + financingCFG.formatCurrency(mon);
                gesamt = formatGesamt(gesamtbetrag, summa);
                showRow = (mon >= 10 && show) ? true : false;
                arr2 = new Array(res, gesamt, '0.00 %', '0.00 %', showRow);
                result[i] = new Array(campaignduration, arr2);
            }
        } else {}

    }
    /* sort result */
    result.sort(sortElements);
    return result;
};